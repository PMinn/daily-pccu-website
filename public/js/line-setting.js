import 'https://static.line-scdn.net/liff/edge/2/sdk.js'

import app from '/js/firebase-app.js';
import { getDatabase, ref as dbRef, child, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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

// init()
//     .then(getUserId)
// .then(getUserInfo)
// .then(fetchWeatherList)
// .then(result => console.log(result))

// weather

function fetchWeatherList() {
    return get(child(dbRef(database), 'weatherLocations'))
        .then(snapshot => snapshot.val())
        .then(weatherLocations => weatherLocations.map(l => {
            return { ...l, checked: false };
        }));
}

const search = document.getElementById('search');
const weather_view = document.getElementById('weather_view');
var weatherLocationsData;
fetchWeatherList()
    .then(weatherLocations => {
        weatherLocationsData = weatherLocations.map(weatherLocation => {
            let location = document.createElement('div');
            location.classList.add('location');
            if (weatherLocation.checked) location.classList.add('checked');
            location.dataset.name = weatherLocation.location;

            let label = document.createElement('div');
            label.classList.add('label');

            let location_name = document.createElement('div');
            location_name.innerText = weatherLocation.location;

            let location_city = document.createElement('div');
            location_city.innerText = weatherLocation.city;

            label.appendChild(location_name);
            label.appendChild(location_city);
            location.appendChild(label);
            weather_view.appendChild(location);

            weatherLocation.DOM = { location, label, location_name, location_city };
            return weatherLocation;
        });
        return weatherLocationsData;
    })
    .then(weatherLocationsData => {
        weatherLocationsData.forEach(weatherLocationData => {
            var target = weatherLocationData.DOM.location;
            target.onclick = e => {
                for (var i = 0; i < weatherLocationsData.length; i++) {
                    if (weatherLocationsData[i].DOM.location == target) {
                        weatherLocationsData[i].checked = !weatherLocationsData[i].checked;
                        if (weatherLocationsData[i].checked) target.classList.add('checked');
                        else target.classList.remove('checked');
                        break;
                    }
                }
                e.stopPropagation();
            }
        })
    })

search.addEventListener('input', () => {
    let filter = search.value;
    weatherLocationsData.forEach(weatherLocationData => {
        if (weatherLocationData.location.includes(filter) || weatherLocationData.city.includes(filter)) weatherLocationData.DOM.location.style.display = 'flex';
        else weatherLocationData.DOM.location.style.display = 'none';
    })
})

// eat

const switch_default = document.getElementById('switch_default');
const switch_custom = document.getElementById('switch_custom');

switch_default.addEventListener('click', () => {
    switch_default.classList.add('checked');
    switch_custom.classList.remove('checked');
})
switch_custom.addEventListener('click', () => {
    switch_custom.classList.add('checked');
    switch_default.classList.remove('checked');
})