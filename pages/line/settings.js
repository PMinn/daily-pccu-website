import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import functions from '../../data/functions.json';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";


export default function Settings() {
  const functionNames = functions.filter(f => f.setting);
  const [view, setView] = useState("weather");
  const [weatherLocations, setWeatherLocations] = useState([]);

  const database = getDatabase(app);

  function locationOnClick(location) {
    setWeatherLocations(weatherLocations.map(wl => {
      if (wl.location == location) wl.checked = !wl.checked;
      return wl;
    }));
  }

  useEffect(() => {
    get(ref(database, 'weatherLocations/'))
      .then(snapshot => snapshot.val())
      .then(weatherLocations => weatherLocations.map(l => ({ ...l, checked: false })))
      .then(wl => setWeatherLocations(wl));
  }, []);

  return (
    <div>
      <Head>
        <title>設定 | 每日文大</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/line/settings.css" />
      </Head>
      <h4 class="header">設定</h4>
      <div class="setting-scroll">
        {
          functionNames.map(functionName => {
            return (
              <div className={'setting-li' + (view == functionName.id ? ' inView' : '')} onClick={() => setView(functionName.id)} key={functionName.id}>
                <div className="icon" dangerouslySetInnerHTML={{ __html: functionName.icon }}></div>
                <div className="title">{functionName.title}</div>
              </div>
            )
          })
        }
      </div>
      <div className="views-out">
        <div className={"view" + (view == "weather" ? " inView" : "")} id="weather_view">
          <div className="search-bar">
            <input type="text" name="search" id="search" placeholder="搜尋" />
          </div>
          <div className="location checked" style={{ opacity: 0.5 }}>
            <div className="label">
              <div>大義館7F</div>
              <div>文化大學</div>
            </div>
          </div>
          {
            weatherLocations.map(weatherLocation => {
              return (
                <div className={"location" + (weatherLocation.checked ? " checked" : "")} onClick={() => locationOnClick(weatherLocation.location)}>
                  <div className="label">
                    <div>{weatherLocation.location}</div>
                    <div>{weatherLocation.city}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={"view" + (view == "eat" ? " inView" : "")} id="eat_view">
          <div className="switch-block">
            <div className="switch">
              <div className="switch-circle checked" id='switch_default'>預設</div>
              <div className="switch-circle" id='switch_custom'>自訂</div>
            </div>
          </div>
        </div>
      </div>
      {/* <Script src='/js/line-setting.js' type='module'></Script> */}
    </div>
  )
}