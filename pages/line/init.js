import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button } from "@heroui/react";
import Layout from '@/components/Layout';
import styles from '@/styles/line/init.module.css';

const SERVER = 'https://daily-pccu-server.vercel.app';
const SETTINGS_LIFF_URL = 'https://liff.line.me/1655168208-29vA01a6';

// 頁面狀態：checking / created / exists / error
const COPY = {
    created: {
        title: '設定完成，歡迎使用',
        text: '帳號已經準備好了。接下來可以到設定頁挑選天氣地點，或加入想吃的餐點。'
    },
    exists: {
        title: '你已經設定過了',
        text: '原本的天氣地點與餐點都還在，不會被更動。'
    },
    error: {
        title: '無法完成設定'
    }
};

// 日戳：中間顯示今天日期，呼應「每日」
function Stamp({ isError }) {
    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}`;
    return (
        <svg
            className={`${styles.stamp} ${isError ? styles['stamp-error'] : ''}`}
            viewBox="0 0 120 120"
            role="img"
            aria-label={isError ? '失敗' : `${date} 完成`}
        >
            <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {isError ? (
                <path d="M42 42 L78 78 M78 42 L42 78" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            ) : (
                <>
                    <text x="60" y="44" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">每日文大</text>
                    <line x1="30" y1="52" x2="90" y2="52" stroke="currentColor" strokeWidth="1.5" />
                    <text x="60" y="84" textAnchor="middle" fontSize="28" className={styles['stamp-date']} fill="currentColor">{date}</text>
                    <path d="M44 95 L54 103 L74 88" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}
        </svg>
    );
}

export default function Init() {
    const [state, setState] = useState({ status: 'checking', message: '' });
    const [liffObject, setLiffObject] = useState(null);

    // liff 初始化
    async function liff_init(liffId) {
        const liff = await import("@line/liff").then(module => module.liff);
        setLiffObject(liff);
        await liff.init({ liffId });
        return liff;
    }

    // 以 LIFF ID Token 呼叫 server 檢查並初始化使用者資料
    async function initUser(idToken) {
        const res = await fetch(`${SERVER}/api/line/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    }

    function closeWindow() {
        liffObject?.closeWindow();
        window.close();
    }

    useEffect(() => {
        (async () => {
            var liffId = "1655168208-aGBcydF5";
            try {
                if (process?.env?.INIT_LIFF_ID) liffId = process.env.INIT_LIFF_ID;
            } catch { }

            try {
                const liff = await liff_init(liffId);
                const idToken = liff.getIDToken();
                if (!idToken) throw new Error('無法取得 LINE 身分，請從 LINE 內開啟此頁面');
                const data = await initUser(idToken);
                setState({ status: data.status === 'created' ? 'created' : 'exists', message: data.message });
            } catch (e) {
                setState({ status: 'error', message: String(e?.message || e) });
            }
        })();
    }, []);

    const { status, message } = state;
    const isChecking = status === 'checking';
    const isError = status === 'error';

    return (
        <Layout options={{ footer: { hidden: true }, nav: { head: { as: "div" } } }}>
            <Head>
                <title>初始化 | 每日文大</title>
                <meta name='description' content='每日文大 LINE Bot 使用者資料初始化頁面，僅限透過 LINE App 內開啟使用。' />
                <meta name='robots' content='noindex, nofollow' />
            </Head>
            <div className={`${styles.stage} ${isChecking ? styles.checking : ''}`} aria-live="polite">
                <div className={styles.mark}>
                    {isChecking
                        ? <img className={styles.logo} src="/images/logo/logo.webp" alt="每日文大" />
                        : <Stamp isError={isError} />}
                </div>

                <div className={styles.body}>
                    {isChecking ? (
                        <p className={styles.title}>正在確認你的帳號…</p>
                    ) : (
                        <>
                            <h1 className={styles.title}>{COPY[status].title}</h1>
                            <p className={styles.text}>
                                {isError ? `${message}。重試仍失敗的話，請填寫回饋並附上這段訊息。` : COPY[status].text}
                            </p>
                        </>
                    )}
                </div>

                {!isChecking && (
                    <div className={styles.actions}>
                        {isError ? (
                            <>
                                <Button color="primary" onPress={() => window.location.reload()}>重新嘗試</Button>
                                <Button as="a" href="/line/form" variant="bordered">填寫回饋</Button>
                            </>
                        ) : (
                            <>
                                <Button as="a" href={SETTINGS_LIFF_URL} color="primary">前往設定</Button>
                                <Button variant="light" onPress={closeWindow}>關閉</Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
