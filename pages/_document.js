import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
    return (
        <Html lang="zh-Hant-TW">
            <Head />
            <body>
                <Main></Main>
                <NextScript></NextScript>
                <Script type="module" src="https://cdn.jsdelivr.net/gh/pminn/banner/src/banner.mjs" strategy="lazyOnload"></Script>
            </body>
        </Html>
    )
}