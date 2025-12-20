import Head from 'next/head';

import HistoryData from '@/data/history.json';
import FunctionsData from '@/data/functions.json';

import styles from '@/styles/index.module.css';

import { useEffect } from "react";
import { app } from '@/js/firebaseConfig.js';
import { getAnalytics, logEvent } from "firebase/analytics";

import Layout from '@/components/Layout';

import { Link, Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function Index() {
    useEffect(() => {
        if (location.host == 'daily-pccu.web.app') getAnalytics(app);
    }, [])

    return (
        <Layout>
            <div className={styles.main}>
                <Head>
                    {/* HTML Meta Tags  */}
                    <title>每日文大</title>
                    <meta name='keywords' content='每日文大,文大天氣,天氣預報,即時天氣,文大bot' />
                    <meta name='description' content='每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!' />

                    {/* Facebook Meta Tags */}
                    <meta property="og:url" content="https://daily-pccu.web.app/" />
                    <meta property="og:type" content="website" /> {/* article */}
                    <meta property='og:title' content='每日文大' />
                    <meta property='og:description' content='每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!' />
                    <meta property="og:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
                    {/*
          檔案大小：< 8MB
          檔案尺寸：建議尺寸 1200x630
          對於圖片的內容 FB 有提供 圖像文字檢查工具 的網站，協助檢測。
          網址的 url 一定要使用絕對路徑
        */}

                    {/* Twitter Meta Tags */}
                    <meta name="twitter:card" content="app" /> {/* summary, summary_large_image, app, player */}
                    <meta property="twitter:domain" content="daily-pccu.web.app" />
                    <meta property="twitter:url" content="https://daily-pccu.web.app/" />
                    <meta name="twitter:title" content="每日文大" />
                    <meta name="twitter:description" content="每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!" />
                    <meta name="twitter:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
                </Head>
                <main>
                    <section className={styles.section + ' w-full py-[5vh] md:py-0 ' + styles.cover}>
                        <div className={styles['left-block']}>
                            <div className={styles.text}>提供各項最新即時資訊<br />的LINE BOT機器人</div>
                            <p className={styles['top-btn']}> ▼ 全功能免費，快速加入 </p>
                            <Button as={Link} color='primary' radius="full" size="lg" href='#add_friend' className='w-[90%] md:w-full mt-2 mb-4 md:mt-2 text-xl'>加入好友</Button>
                        </div>
                        <div className={styles['right-block']}>
                            <img
                                src="/images/portrait_w480.webp"
                                srcSet='/images/portrait_w330.webp 600w'
                                alt="每日文大 實際使用 範例圖"
                                loading='eager'
                                priority='true'
                                width="783"
                                height="1626"
                            />
                            <svg className={styles['blob']} viewBox='0 0 900 900' width='900' height='900' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.1' >
                                <g transform='translate(464.5299756263622 420.5024700757476)'>
                                    <path d='M221.4 -207.5C289.5 -153.2 349.3 -76.6 347.5 -1.8C345.7 73.1 282.5 146.1 214.3 211C146.1 275.8 73.1 332.4 -9.7 342.1C-92.4 351.7 -184.8 314.5 -259.8 249.6C-334.8 184.8 -392.4 92.4 -372.7 19.7C-353 -53 -256.1 -106.1 -181.1 -160.4C-106.1 -214.7 -53 -270.4 11.8 -282.2C76.6 -293.9 153.2 -261.9 221.4 -207.5'></path>
                                </g>
                            </svg>
                        </div>
                        <div className={styles.wave}>
                            <svg viewBox='0 0 960 540' width='960' height='540' mlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.1' >
                                <path d='M0 390L53.3 409C106.7 428 213.3 466 320 460.3C426.7 454.7 533.3 405.3 640 375.3C746.7 345.3 853.3 334.7 906.7 329.3L960 324L960 541L906.7 541C853.3 541 746.7 541 640 541C533.3 541 426.7 541 320 541C213.3 541 106.7 541 53.3 541L0 541Z' strokeLinecap='round' strokeLinejoin='miter'></path>
                            </svg>
                        </div>
                    </section>
                    <section className={styles.section + ' w-full py-[5vh] md:py-0 ' + styles.functions}>
                        <h2 className='text-4xl mb-[5vh] text-center'>功能</h2>
                        <div className={styles.table}>
                            {
                                FunctionsData.map(func => {
                                    return (
                                        <div key={func.title}>
                                            <div dangerouslySetInnerHTML={{ __html: func.icon }} className='flex justify-center'></div>
                                            <h3>
                                                <p>{func.title}</p>
                                            </h3>
                                            <p>{func.description}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                    <section id="add_friend" className={styles.section + ' w-full py-[5vh] md:py-0 ' + styles['add-friend']}>
                        <h2 className='text-4xl mb-[5vh] text-center'>如何加入</h2>
                        <div className='flex gap-3 flex-col md:flex-row'>
                            <Card className='w-[80vw] md:w-60 box-border'>
                                <CardHeader className="justify-center box-border">點擊按鈕</CardHeader>
                                <CardBody className='flex flex-row justify-center box-border'>
                                    <Link href='https://lin.ee/SeaAhEv' className={styles['line-btn']}>
                                        <img src='https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png' alt='加入每日文大好友' border='0' width='232' height='72'></img>
                                    </Link>
                                </CardBody>
                            </Card>
                            <Card className='w-[80vw] md:w-60'>
                                <CardHeader className="justify-center box-border">掃描QR code</CardHeader>
                                <CardBody className='flex flex-row justify-center box-border'>
                                    <img src="https://qr-official.line.me/gs/M_037gujtt_BW.png?oat__id=4820382&oat_content=qr" alt='加入每日文大好友' width='180' height='180'></img>
                                </CardBody>
                            </Card>
                            <Card className='w-[80vw] md:w-60'>
                                <CardHeader className="justify-center box-border">輸入LINE ID</CardHeader>
                                <CardBody className='flex flex-row justify-center box-border'>
                                    <p>line主頁右上方加入好友 &gt; 右上方搜尋 &gt; 選擇id &gt; 輸入:<span>@037gujtt</span></p>
                                </CardBody>
                            </Card>
                        </div>
                    </section>
                    <section id='history' className={styles.section + ' w-full py-[5vh] md:py-0 ' + styles['history']}>
                        <h2 className='text-4xl mb-[5vh] text-center'>重大事件</h2>
                        <table cellSpacing='0' cellPadding='0'>
                            <tbody>
                                {
                                    HistoryData.map(history => {
                                        return (
                                            <tr key={history.time}>
                                                <td>{history.time}</td>
                                                <td>{history.description}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </Layout>
    )
}