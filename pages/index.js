import Head from 'next/head'
import styles from '../styles/Home.module.css';

import Link from 'next/link';
import Image from 'next/image';

import screen_shot2 from '../images/screen-shot2.png'
import screen_shot from '../images/screen-shot.png'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="top">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="info">
          <h2 class="showAni hidden has-hr">「每日文大」是每個文化大學學生必備的工具，核心為line bot機器人，可以查詢天氣、公車進站時間、學校最新消息……等，只要有每日文大，不管何時何地，都可以掌握最新及時資訊。</h2>
          <h1 class="name has-hr"><span class="showAni hidden">每日</span><span class="showAni hidden">文大</span></h1>
          <div class="add-friend-outer">
            <a href="#add_friend" class="btn showAni hidden">加入好友</a>
          </div>
        </div>
        <div class="phone">
          <Image src={screen_shot2} width={1400} height={2700} alt="每日文大 line bot demo chat"></Image>
          <Image src={screen_shot} width={1400} height={2700} alt="每日文大 line bot demo page"></Image>
        </div>
      </div>
      <div id="add_friend" class="block">
        <h1 class="showAni hidden">如何加入好友?</h1>
        <ol>
          <div class="showAni hidden">
            <li>點擊按鈕</li>
            <a href="https://lin.ee/h0kZmTc"><Image src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="加入每日文大好友" width={232} height={72} ></Image></a>
          </div>
          <div class="showAni hidden">
            <li>掃描QR code</li>
            <Image src="https://qr-official.line.me/sid/M/037gujtt.png" width={180} height={180} alt="加入每日文大好友"></Image>
          </div>
          <div class="showAni hidden">
            <li>輸入LINE ID</li>
            <p>在line中，搜尋id：<span style={{ fontWeight: 900, fontSize: '1.2em' }}>@037gujtt</span> (@不能省略喔)</p>
          </div>
        </ol>
      </div>
      <div id="history" class="block">
        <h1 class="showAni hidden">重大事件</h1>
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr class="showAni hidden">
              <td>2021/10/21</td>
              <td>使用人數突破5,000人</td>
            </tr>
            <tr class="showAni hidden">
              <td>2021/10/05</td>
              <td>大改版，新的樣貌與更多元的功能</td>
            </tr>
            <tr class="showAni hidden">
              <td>2021/03/15</td>
              <td>使用人數突破4,000人</td>
            </tr>
            <tr class="showAni hidden">
              <td>2021/02/24</td>
              <td>使用人數兩天內突破3,100人，大量使用者湧入，導致系統流量過大，進入緊急維修作業</td>
            </tr>
            <tr class="showAni hidden">
              <td>2021/02/23</td>
              <td>使用人數一天內突破2,100人</td>
            </tr>
            <tr class="showAni hidden">
              <td>2021/02/22</td>
              <td>正式上線，與大家初次見面</td>
            </tr>
            <tr class="showAni hidden">
              <td>2020/10/18</td>
              <td>每日文大創立</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}