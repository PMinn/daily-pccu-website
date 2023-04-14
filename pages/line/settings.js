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