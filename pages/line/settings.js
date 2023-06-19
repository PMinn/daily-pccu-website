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

  const [liffObject, setLiffObject] = useState(null);
  const [liffContext, setLiffContext] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const database = getDatabase(app);

  function getNumberOfLocationsChecked() {
    return weatherLocations.filter(wl => wl.checked).length;
  }

  function eatOnclick(isEatChangeToCustom) {
    setIsEatCustom(isEatChangeToCustom);
    save();
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
    save();
  }

  function save() {

  }

  useEffect(() => {
    import("@line/liff")
      .then(liff => liff.liff)
      .then(liff => {
        liff.init({ liffId: "1655168208-9NvVk86X" })
          .then(() => {
            var context = liff.getContext();
            if (context.type == "none" || context.type == "external") {
              return Promise.reject({
                code: "PROGRAM_FORBIDDEN",
                message: "請使用正常路徑開啟"
              });
            } else {
              setLiffObject(liff);
              setLiffContext(context);
              Promise.all([
                get(ref(database, 'weatherLocations/')).then(snapshot => snapshot.val()),
                get(ref(database, `users/${context.userId}`)).then(snapshot => snapshot.val())
              ])
                .then(([wl, user]) => {
                  setWeatherLocations(wl.map(l => {
                    return {
                      ...l,
                      checked: user.weather.includes(l.location)
                    }
                  }));
                  setIsEatCustom(user.isEatAvailable);
                  setCustomValue(user.eat);
                })
            }
          })
          .catch(err => {
            setErrorText(`錯誤代碼:\n${err.code}\n\n錯誤訊息:\n${err.message}\n請重新開啟頁面`);
          });
      });
  }, []);

  return (
    <div>
      <Head>
        <title>設定 | 每日文大</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/line/settings.css" />
      </Head>

      <ConfirmComponent title={""} content={"最多只能選擇12個地點"} show={locationsOverflow} btn={["好"]} onClick={[() => setLocationsOverflow(false)]}></ConfirmComponent>
      <div style={{ display: (errorText != null ? 'none' : '') }}>
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
            <div className="location checked disable">
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
              <div className={"switch-circle " + (isEatCustom ? "" : "checked")} onClick={() => eatOnclick(false)}>預設</div>
              <div className={"switch-circle " + (isEatCustom ? "checked" : "")} onClick={() => eatOnclick(true)}>自訂</div>
            </div>
            <div className={'custom-value' + (!isEatCustom ? ' disable' : '')}>
              <label className="input-group" htmlFor="custom_value">
                <input type="text" className={fontClass} placeholder=" " onInput={e => setCustomValue(e.target.value)} value={customValue} id='custom_value' disabled={!isEatCustom} />
                <div className='label'>自訂選項</div>
                <div className="note">選項間請使用半形逗號(,)分隔</div>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* <Script src='/js/line-setting.js' type='module'></Script> */}
      <div className='error' style={{ display: (errorText == null ? 'none' : '') }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
        <pre><span>{errorText}</span></pre>
      </div>
    </div>
  )
}