import Head from 'next/head'
import Script from 'next/script'

import styles from '../../styles/LineSetting.module.css'


export default function LineSetting({ data }) {
  return (
    <div>
      <Head>
        <title>每日文大</title>
      </Head>
      {/* <Script src="https://static.line-scdn.net/liff/edge/2/sdk.js" onLoad={() => {
        liff.init({
          liffId: '1655168208-29vA01a6'
        }).then(start);
      }
      }></Script> */}
      <Script strategy="afterInteractive" src='/js/line-setting.js' type="module"></Script>
      <div className={styles['labels']}>
        <div  className={styles['check']}>天氣</div>
        <div>吃什麼</div>
      </div>
      <div className={styles['page-container']}>
      <div className={styles['page-flex']}>
        <div className={styles['page']}>
          {
            data.map(d => (
              <div className={styles['location']} key={d.stationId} data-location={d.locationName}>
                <div className={styles['name']}>{d.locationName}</div>
                <div className={styles['city']}>{d.parameter[0].parameterValue}</div>
              </div>
            ))
          }
        </div>
        <div className={styles['page']}></div>
      </div>
      </div>
    </div>
  )
}

function fetchWeatherList() {
  return fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-2C162C9D-F4FB-4C4A-88CD-17745742A4BE&format=JSON&elementName=none&parameterName=CITY')
    .then(response => response.json())
    .then(response => response.records.location)
    .then(response => {
      return response.sort((a,
        b) => {
        if (a.parameter[0].parameterValue < b.parameter[0].parameterValue) {
          return -1;
        } else if (a.parameter[0].parameterValue > b.parameter[0].parameterValue) {
          return 1;
        } else {
          if (a.locationName.length > b.locationName.length) {
            return 1;
          } else if (a.locationName.length < b.locationName.length) {
            return -1;
          } else {
            if (a.locationName > b.locationName) {
              return 1;
            } else if (a.locationName < b.locationName) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      });
    });
}

export async function getStaticProps () {
  // var data = await fetchWeatherList();
  var data = [{
    "lat": "10.371770",
    "lon": "114.356682",
    "locationName": "南沙島",
    "stationId": "469020",
    "time": {
      "obsTime": "2023-03-0217:40:00"
    },
    "weatherElement": [],
    "parameter": [{
      "parameterName": "CITY",
      "parameterValue": "高雄市"
    }]
  },
  {
    "lat": "24.799541",
    "lon": "121.000695",
    "locationName": "國一N094K",
    "stationId": "CAD050",
    "time": { "obsTime": "2023-03-02 17:40:00" },
    "weatherElement": [],
    "parameter": [{
      "parameterName": "CITY",

      "parameterValue": "新竹市"
    }]
  },
  {
    "lat": "24.206657",
    "lon": "120.647035",
    "locationName": "國一N174K",
    "stationId": "CAF010",
    "time": { "obsTime": "2023-03-02 17:40:00" },
    "weatherElement": [],
    "parameter": [{
      "parameterName": "CITY",
      "parameterValue": "臺中市"
    }]
  },
  {
    "lat": "23.497671",
    "lon": "120.424783",
    "locationName": "嘉義",
    "stationId": "467480",
    "time": { "obsTime": "2023-03-02 17:40:00" },
    "weatherElement": [],
    "parameter": [{
      "parameterName": "CITY",
      "parameterValue": "嘉義市"
    }]
  },
  {
    "lat": "24.728088",
    "lon": "120.932448",
    "locationName": "國一S105K",
    "stationId": "CAD010",
    "time": { "obsTime": "2023-03-02 17:40:00" },
    "weatherElement": [],
    "parameter": [{
      "parameterName": "CITY",
      "parameterValue": "新竹縣"
    }]
  }]
  return { props: { data } }
}