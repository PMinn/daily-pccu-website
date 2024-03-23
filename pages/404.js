import Head from 'next/head';
import Layout from '@/components/Layout';
import { Button, Link } from '@nextui-org/react';

export default function Custom404() {
    return (
        <Layout>
            <Head>
                <title>404 | 每日文大</title>
                <meta name='keywords' content='每日文大,文大天氣,天氣預報,即時天氣,文大bot' />
                <meta property='og:title' content='每日文大' />
                <meta name='description' content='每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!' />
                <meta property='og:description' content='每日文大是文化大學學生必備的工具，透過Line Bot機器人查詢天氣、公車進站時間及學校最新消息等。隨時隨地，掌握最新資訊!' />
            </Head>
            <section className="w-full h-screen flex flex-col justify-center items-center gap-10">
                <h1 className="text-8xl">404</h1>
                <h2>糟糕！找不到頁面</h2>
                <Button href='/' color='primary' as={Link}>回首頁</Button>
            </section>
        </Layout>
    )
}