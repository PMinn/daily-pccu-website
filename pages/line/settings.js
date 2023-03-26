import Head from 'next/head';
import Script from 'next/script';
import { useState } from "react";
import functions from '../../data/functions.json';

export default function LineSetting({ }) {
  const settingsFunction = functions.filter(f => f.setting);
  const [view, setView] = useState("weather");
  const changeView = e => {
    let target = e.target;
    while (!target.classList.contains('setting-li')) {
      target = target.parentElement;
    }
    setView(target.dataset.id);
    e.stopPropagation();
  }

  return (
    <div>
      <Head>
        <title>每日文大 | 設定</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/LineSetting.css" />
      </Head>
      <h4 class="header">設定</h4>
      <div class="setting-scroll">
        {
          settingsFunction.map(f => {
            return (
              <div className={"setting-li " + (view == f.id ? "inView" : "")} onClick={changeView} data-id={f.id} key={f.id}>
                <div class="icon" dangerouslySetInnerHTML={{ __html: f.icon }}></div>
                <div class="title">{f.title}</div>
              </div>
            )
          })
        }
      </div>
      <div class="views-out">
        <div class={"view " + (view == "weather" ? "inView" : "")} id="weather_view">
          <div class="search-bar">
            <input type="text" name="search" id="search" placeholder="搜尋" />
          </div>
          <div class="location checked" style={{ opacity: 0.5 }}>
            <div class="label">
              <div>大義館7F</div>
              <div>文化大學</div>
            </div>
            <div class="icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.4451 1.80291C31.8533 1.35906 30.9655 1.35906 30.3736 2.09881L26.0826 7.42503C23.7152 5.79758 20.9038 4.90987 17.7965 4.90987C9.65845 4.90987 3 11.5677 3 19.7049C3 27.8422 9.65845 34.5 17.7965 34.5C25.9346 34.5 32.5931 27.8422 32.5931 19.7049C32.5931 16.7459 31.7053 14.0828 30.2256 11.7156L29.1899 12.8992L28.1541 14.0828L19.5721 24.8832C19.2762 25.1791 18.8323 25.475 18.3884 25.475C17.9445 25.475 17.6486 25.3271 17.3527 25.0312L10.9901 18.2254C10.5462 17.7816 10.5462 17.0418 10.6942 16.598C10.6942 16.45 10.8422 16.3021 10.9901 16.1541C11.582 15.5623 12.4698 15.5623 13.0617 16.1541L18.2404 21.7762L26.3785 11.5677L27.2663 10.384L28.1541 9.20044L32.4451 3.87422C33.185 3.28242 33.185 2.39471 32.4451 1.80291Z" /></svg>
            </div>
          </div>
        </div>
        <div class={"view " + (view == "eat" ? "inView" : "")} id="eat_view">
          <div class="switch-block">
            <div class="switch">
              <div class="switch-circle checked" id='switch_default'>預設</div>
              <div class="switch-circle" id='switch_custom'>自訂</div>
            </div>
          </div>
        </div>
      </div>
      <Script src='/js/line-setting.js' type='module'></Script>
    </div>
  )
}