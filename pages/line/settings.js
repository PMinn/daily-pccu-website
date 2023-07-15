import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import functions from '../../data/functions.json';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref, get, set } from "firebase/database";

import ConfirmComponent from '../../components/ConfirmComponent.js';
import LoadingComponent from '../../components/LoadingComponent.js';

import styles from '../../styles/line/settings.module.css';

export default function Settings({ fontClass }) {
  const functionNames = functions.filter(f => f.setting);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("weather");
  const [weatherLocations, setWeatherLocations] = useState([]);
  const [locationsOverflow, setLocationsOverflow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isEatCustom, setIsEatCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const [liffContext, setLiffContext] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const database = getDatabase(app);

  function getNumberOfLocationsChecked() {
    return weatherLocations.filter(wl => wl.checked).length;
  }

  async function eatOnclick(isEatChangeToCustom) {
    setIsEatCustom(isEatChangeToCustom);
    await set(ref(database, `users/${liffContext.userId}/isEatAvailable`), isEatChangeToCustom);
  }

  async function locationOnClick(location) {
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
    await set(ref(database, `users/${liffContext.userId}/weather`), weatherLocations.filter(wl => wl.checked).map(wl => wl.location));
  }

  async function customValueOnChange(e) {
    setCustomValue(e.target.value);
    await set(ref(database, `users/${liffContext.userId}/eat`), e.target.value);
  }

  useEffect(() => {
    import("@line/liff")
      .then(liff => liff.liff)
      .then(liff => {
        liff.init({ liffId: "1655168208-29vA01a6" })
          .then(() => {
            var context = liff.getContext();
            if (context.type == "none" || context.type == "external") {
              return Promise.reject({
                code: "PROGRAM_FORBIDDEN",
                message: "請使用正常路徑開啟"
              });
            } else {
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
                  setLoading(false);
                })
            }
          })
          .catch(err => {
            setErrorText(`錯誤代碼:\n${err.code}\n\n錯誤訊息:\n${err.message}\n請重新開啟頁面`);
          });
      });
  }, []);

  return (
    <div className={styles.main}>
      <Head>
        <title>設定 | 每日文大</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="/css/line/settings.css" />
      </Head>
      <LoadingComponent show={loading}></LoadingComponent>
      <ConfirmComponent title={""} content={"最多只能選擇12個地點"} show={locationsOverflow} btn={["好"]} onClick={[() => setLocationsOverflow(false)]}></ConfirmComponent>
      <div style={{ display: (errorText != null ? 'none' : '') }}>
        <h4 className={styles.header}>設定</h4>
        <div className={styles['setting-scroll']}>
          {
            functionNames.map(functionName => {
              return (
                <div className={styles['setting-li'] + ' ' + (view == functionName.id ? styles.inView : '')} onClick={() => setView(functionName.id)} key={functionName.id}>
                  <div className={styles.icon} dangerouslySetInnerHTML={{ __html: functionName.icon }}></div>
                  <div className={styles.title}>{functionName.title}</div>
                </div>
              )
            })
          }
        </div>
        <div className={styles['views-out']}>
          <div className={styles.view + " " + (view == "weather" ? styles.inView : "")} id="weather_view">
            <div className={styles['search-bar']}>
              <input type="text" name="search" id="search" placeholder="搜尋" onInput={e => setSearchValue(e.target.value)} />
            </div>
            <div className={styles.location + " " + styles.checked + " " + styles.disable}>
              <div className={styles.label}>
                <div>大義館7F</div>
                <div>文化大學</div>
              </div>
            </div>
            {
              weatherLocations.map((weatherLocation, index) => {
                return (
                  <div className={styles.location + " " + (weatherLocation.checked ? styles.checked : "")} style={{ display: (weatherLocation.location.includes(searchValue) || weatherLocation.city.includes(searchValue) ? '' : 'none') }} onClick={() => locationOnClick(weatherLocation.location)} key={'weatherLocation_' + index}>
                    <div className={styles.label}>
                      <div>{weatherLocation.location}</div>
                      <div>{weatherLocation.city}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.view + " " + (view == "eat" ? styles.inView : "")} id="eat_view">
            <div className={styles.switch}>
              <div className={styles['switch-circle'] + " " + (isEatCustom ? "" : styles.checked)} onClick={() => eatOnclick(false)}>預設</div>
              <div className={styles['switch-circle'] + " " + (isEatCustom ? styles.checked : "")} onClick={() => eatOnclick(true)}>自訂</div>
            </div>
            <div className={styles['custom-value'] + " " + (!isEatCustom ? styles.disable : '')}>
              <label className={styles['input-group']} >
                <input type="text" className={fontClass} placeholder=" " onInput={e => setCustomValue(e.target.value)} value={customValue} disabled={!isEatCustom} onChange={customValueOnChange} />
                <div className={styles.label}>自訂選項</div>
                <div className={styles.note}>選項間請使用半形逗號(,)分隔</div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.error} style={{ display: (errorText == null ? 'none' : '') }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
        <pre><span>{errorText}</span></pre>
      </div>
    </div >
  )
}