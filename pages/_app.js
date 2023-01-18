import '../styles/globals.css'
import Head from 'next/head'
export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_package/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_package/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_package/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_package/site.webmanifest" />
        <link rel="mask-icon" href="/favicon_package/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content="每日文大" />
        <meta name="application-name" content="每日文大" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon_package/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}