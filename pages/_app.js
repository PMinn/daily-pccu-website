import '../styles/globals.css'
import Head from 'next/head'
import localFont from 'next/font/local'

import { analytics } from "../firebaseConfig.js";

import { useEffect } from 'react';

const jf_openhuninn = localFont({ src: '../public/fonts/jf-openhuninn-2.0.ttf' })

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (window.location.hostname == "daily-pccu.web.app") {
      analytics;
      console.log(window.location.hostname)
    }
  }, [])
  return (
    <main className={jf_openhuninn.className}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_package/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_package/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="194x194" href="/favicon_package/favicon-194x194.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon_package/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_package/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_package/site.webmanifest" />
        <link rel="mask-icon" href="/favicon_package/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content="每日文大" />
        <meta name="application-name" content="每日文大" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon_package/favicon.ico" />
        <meta name="description" content="「每日文大」是每個文化大學學生必備的工具，核心為line bot機器人，可以查詢天氣、公車進站時間、學校最新消息……等，只要有每日文大，不管何時何地，都可以掌握最新及時資訊。" />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}