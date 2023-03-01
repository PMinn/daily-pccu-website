import { Html, Head, Main, NextScript } from 'next/document'
// import Script from 'next/script'

export default function Document() {
    return (
        <Html lang="zh-Hant-TW">
            <Head />
            <body>
                <Main />
                <NextScript />
                <script JSX type="module" src="https://cdn.jsdelivr.net/gh/pminn/banner/src/banner.mjs"></script>
            </body>
        </Html>
    )
}