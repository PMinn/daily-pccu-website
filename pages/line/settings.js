import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import functions from '../../data/functions.json';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";

import ConfirmComponent from '../../components/confirmComponent.js';

export default function Settings({ fontClass }) {
  const functionNames = functions.filter(f => f.setting);
  const [view, setView] = useState("weather");
  const [weatherLocations, setWeatherLocations] = useState([]);
  const [locationsOverflow, setLocationsOverflow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isEatCustom, setIsEatCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const database = getDatabase(app);

  function getNumberOfLocationsChecked() {
    return weatherLocations.filter(wl => wl.checked).length;
  }

  function locationOnClick(location) {
    setWeatherLocations(weatherLocations.map(wl => {
      if (wl.location == location) {
        if (!wl.checked) {
          if (getNumberOfLocationsChecked() >= 11) {
            setLocationsOverflow(true);
          } else {
            wl.checked = !wl.checked;
          }
        } else {
          wl.checked = !wl.checked;
        }
      }
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
      <ConfirmComponent title={""} content={"最多只能選擇12個地點"} show={locationsOverflow} btn={["好"]} onClick={[() => setLocationsOverflow(false)]}></ConfirmComponent>
      <h4 className="header">設定</h4>
      <div className="setting-scroll">
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
            <input type="text" name="search" id="search" placeholder="搜尋" onInput={e => setSearchValue(e.target.value)} />
          </div>
          <div className="location checked" style={{ opacity: 0.5 }}>
            <div className="label">
              <div>大義館7F</div>
              <div>文化大學</div>
            </div>
          </div>
          {
            weatherLocations.map((weatherLocation, index) => {
              return (
                <div className={"location" + (weatherLocation.checked ? " checked" : "")} style={{ display: (weatherLocation.location.includes(searchValue) || weatherLocation.city.includes(searchValue) ? '' : 'none') }} onClick={() => locationOnClick(weatherLocation.location)} key={'weatherLocation_' + index}>
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
          <div className="switch">
            <div className={"switch-circle " + (isEatCustom ? "" : "checked")} onClick={() => setIsEatCustom(false)}>預設</div>
            <div className={"switch-circle " + (isEatCustom ? "checked" : "")} onClick={() => setIsEatCustom(true)}>自訂</div>
          </div>
          <div className='custom-value'>
            <label className="input-group" htmlFor="custom_value">
              <input type="text" className={fontClass} placeholder=" " onInput={e => setCustomValue(e.target.value)} value={customValue} id='custom_value' />
              <div className='label'>自訂選項</div>
              <div className="note">選項間請使用半形逗號(,)分隔</div>
            </label>
          </div>
        </div>
      </div>
      {/* <Script src='/js/line-setting.js' type='module'></Script> */}
    </div>
  )
}