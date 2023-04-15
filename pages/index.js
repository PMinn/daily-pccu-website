import Head from 'next/head'
import styles from '../styles/Home.module.css';

import Image from 'next/image';

import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';

import HistoryData from '../data/history.json';
import FunctionsData from '../data/functions.json';

// import portrait_w480 from '../public/images/portrait_w480.webp';
// import portrait_h741 from '../public/images/portrait_h741.webp';
import portrait from '../public/images/portrait.webp';
// srcset={portrait_w480.src + ' 600w, ' + portrait_h741.src + ' 2000w'} sizes="(max-width:600px) 80vw, calc((380px + 19vw)) * (1314 / 2661)"
export default function Home() {
  return (
    <div>
      <Head>
        <title>每日文大</title>
      </Head>
      <NavComponent></NavComponent>
      <section id={styles.cover} className={styles.section}>
        <div className={styles['left-block']}>
          <h1>提供各項最新即時資訊<br />的LINE BOT機器人</h1>
          <p className={styles['top-btn']}> ▼ 全功能免費，快速加入 </p>
          <a data-target="#add_friend" className="btn btn-second" id='cover_addFriend_btn'>加入好友</a>
        </div>
        <div className={styles['right-block']}>
          <Image src={portrait} alt="每日文大 實際使用 範例圖" loading="eager" priority="true" as={"image"}></Image>
          <svg class={styles["blob"]} viewBox="0 0 900 900" width="900" height="900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" xmlnsSvgjs="http://svgjs.dev/svgjs" xmlnsData="ApexChartsNS">
            <g transform="translate(464.5299756263622 420.5024700757476)">
              <path d="M221.4 -207.5C289.5 -153.2 349.3 -76.6 347.5 -1.8C345.7 73.1 282.5 146.1 214.3 211C146.1 275.8 73.1 332.4 -9.7 342.1C-92.4 351.7 -184.8 314.5 -259.8 249.6C-334.8 184.8 -392.4 92.4 -372.7 19.7C-353 -53 -256.1 -106.1 -181.1 -160.4C-106.1 -214.7 -53 -270.4 11.8 -282.2C76.6 -293.9 153.2 -261.9 221.4 -207.5"></path>
            </g>
          </svg>
        </div>
        <div className={styles["wave-out"]} >
          <svg class={styles["wave"]} viewBox="0 0 960 540" width="960" height="540" mlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" xmlnsSvgjs="http://svgjs.dev/svgjs" xmlnsData="ApexChartsNS">
            <path d="M0 390L53.3 409C106.7 428 213.3 466 320 460.3C426.7 454.7 533.3 405.3 640 375.3C746.7 345.3 853.3 334.7 906.7 329.3L960 324L960 541L906.7 541C853.3 541 746.7 541 640 541C533.3 541 426.7 541 320 541C213.3 541 106.7 541 53.3 541L0 541Z" stroke-linecap="round" stroke-linejoin="miter"></path>
          </svg>
        </div>
      </section>
      <section id={styles.functions} className={styles.section}>
        <div className={styles.table}>
          {FunctionsData.map(func => {
            return (
              <div key={func.title}>
                <div dangerouslySetInnerHTML={{ __html: func.icon }}></div>
                <h3>
                  <p>{func.title}</p>
                </h3>
                <p>{func.description}</p>
              </div>
            )
          })}
        </div>
      </section>
      <section id='add_friend' className={"section add_friend".split(' ').map(s => styles[s]).join(' ')}>
        <h2>如何加入</h2>
        <div className={styles.table}>
          <div>
            <h3>點擊按鈕</h3>
            <div data-href='https://lin.ee/h0kZmTc' id='line_btn' className={styles['line-btn']}>
              <img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加入每日文大好友" border="0" width="232" height="72"></img>
            </div>
          </div>
          <div>
            <h3>掃描QR code</h3>
            <img src="https://qr-official.line.me/sid/M/037gujtt.png" alt="加入每日文大好友" width="180" height="180"></img>
          </div>
          <div>
            <h3>輸入LINE ID</h3>
            <p>line主頁右上方加入好友 &gt; 右上方搜尋 &gt; 選擇id &gt; 輸入:<span>@037gujtt</span></p>
          </div>
        </div>
      </section>
      <section id="history" className={"history section".split(' ').map(s => styles[s]).join(' ')}>
        <h2>重大事件</h2>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            {HistoryData.map(history => {
              return (
                <tr key={history.time}>
                  <td>{history.time}</td>
                  <td>{history.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      <FooterComponent></FooterComponent>
      <script type="module" src="/js/index.js"></script>
    </div>
  )
}