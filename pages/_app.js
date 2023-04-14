import '../styles/globals.css'
import Head from 'next/head'
import localFont from 'next/font/local'

const jf_openhuninn = localFont({ src: '../public/fonts/jf-openhuninn-2.0.ttf' })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={jf_openhuninn.className}>
      <Head>
        <meta name="description" content="「每日文大」是每個文化大學學生必備的工具，核心為line bot機器人，可以查詢天氣、公車進站時間、學校最新消息……等，只要有每日文大，不管何時何地，都可以掌握最新及時資訊。" />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_package/apple-touch-icon.png?v=4.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_package/favicon-32x32.png?v=4.0" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_package/favicon-16x16.png?v=4.0" />
        <link rel="manifest" href="/favicon_package/site.webmanifest?v=4.0" />
        <link rel="mask-icon" href="/favicon_package/safari-pinned-tab.svg?v=4.0" color="#ffb11b" />
        <link rel="shortcut icon" href="/favicon_package/favicon.ico?v=4.0" />
        <meta name="apple-mobile-web-app-title" content="每日文大" />
        <meta name="application-name" content="每日文大" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon_package/mstile-144x144.png?v=4.0" />
        <meta name="msapplication-config" content="/favicon_package/browserconfig.xml?v=4.0" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:title" content="每日文大" />
        <meta property="og:image" content="/favicon_package/android-chrome-384x384.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}