import Head from 'next/head'
import styles from '../styles/Home.module.css';

import Link from 'next/link';
import Image from 'next/image';

import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';

import HistoryData from '../data/history.json';
import FunctionsData from '../data/functions.json';

import portrait_w480 from '../public/images/portrait_w480.webp';
import portrait_h741 from '../public/images/portrait_h741.webp';
import wave from '../public/images/wave.svg';
import blob from '../public/images/blob.svg';

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
          <Link href="/#add_friend" className="btn btn-second" id='cover_addFriend_btn'>加入好友</Link>
        </div>
        <div className={styles['right-block']}>
          <Image src={portrait_w480} srcset={portrait_w480.src + ' 600w, ' + portrait_h741.src + ' 2000w'} alt="每日文大 實際使用 範例圖" loading="eager" sizes="(max-width:600px) 80vw, calc((380px + 19vw)) * (1314 / 2661)" priority="true" as={"image"}></Image>
          <Image src={blob} alt='每日文大 實際使用 範例圖 底部裝飾' />
        </div>
        <div className={styles["wave-out"]} >
          <Image src={wave} alt='每日文大 實際使用 範例圖 底部裝飾' />
        </div>
      </section>
      <section id={styles.functions} className={styles.section}>
        <div className={"table center".split(' ').map(s => styles[s]).join(' ')}>
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
        <div className={"table between c3".split(' ').map(s => styles[s]).join(' ')}>
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