import Head from 'next/head';
import Link from 'next/link';

import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';

export default function Custom404() {
    return (
        <div>
            <Head>
                <title>404 | 每日文大</title>
                <meta name="keywords" content="每日文大,文大天氣,天氣預報,即時天氣,文大bot" />
                <meta property="og:title" content="每日文大" />
                <meta name="description" content="每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!" />
                <meta property="og:description" content="每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!" />
                <link rel="stylesheet" href="/css/404.css" />
            </Head>
            <NavComponent></NavComponent>
            <section>
                <h1>404</h1>
                <h2>糟糕！找不到頁面</h2>
                <Link href='/' className='btn btn-first'>回首頁</Link>
            </section>
            <FooterComponent></FooterComponent>
        </div>
    )
}