import Head from 'next/head'
import Script from 'next/script'

export default function LineSetting() {
  return (
    <div>
      <Head>
        <title>每日文大</title>
      </Head>
      <Script id="show-banner" strategy="afterInteractive">
        {`
          async function start() {
            // var userId = await liff.getContext().userId;
            console.log(liff.getContext())
          }
        `}
      </Script>
      <Script src="https://static.line-scdn.net/liff/edge/2/sdk.js" onLoad={() => {
        liff.init({ liffId: '1655168208-29vA01a6' }).then(start);
      }
      }></Script>
      {/* <Script src='/js/ling-setting.js'></Script> */}
    </div>
  )
}