import 'https://static.line-scdn.net/liff/edge/2/sdk.js'

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import { getDatabase, ref as dbRef, child, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const app = initializeApp({
    apiKey: "AIzaSyCPq-VtQask8BdUmwojqfp4tq_WbkTlbEw",
    authDomain: "daily-pccu.firebaseapp.com",
    databaseURL: "https://daily-pccu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "daily-pccu",
    storageBucket: "daily-pccu.appspot.com",
    messagingSenderId: "805313945825",
    appId: "1:805313945825:web:a966b8c9d9902dbca417a0",
    measurementId: "G-FV6BTQPGNN"
});
const database = getDatabase(app);

function init() {
    return liff.init({
        liffId: '1655168208-29vA01a6'
    });
}

function getUserId() {
    // var userId = await liff.getContext().userId;
    var userId = 'Ud29cfcb901fa5c6a56c4b1bd6510c7d0';
    return userId;
}

function getUserInfo(userId) {
    return get(child(dbRef(database), `users/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return "No data available";
            }
        });

    //  firebase.database().ref('/users/' + userId).once('value')
    //     .then(tdata => {
    //         if (!tdata.exists()) {
    //             var info = {
    //                 weather: '',
    //                 eat: '',
    //                 openEat: 0
    //             };
    //             firebase.database().ref('/users/' + userId).set(info);
    //             return info;
    //         } else return tdata.val();
    //     })
}

function fetchWeatherList() {
    return fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-2C162C9D-F4FB-4C4A-88CD-17745742A4BE&format=JSON&elementName=none&parameterName=CITY')
        .then(response => response.json())
        .then(response => response.records.location)
        .then(response => {
            return response.sort((a, b) => {
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


// init()
//     .then(getUserId)
// .then(getUserInfo)
// .then(fetchWeatherList)
// .then(result => console.log(result))