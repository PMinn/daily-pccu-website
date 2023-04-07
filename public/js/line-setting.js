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

            let icon = document.createElement('div');
            icon.classList.add('icon');
            icon.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.4451 1.80291C31.8533 1.35906 30.9655 1.35906 30.3736 2.09881L26.0826 7.42503C23.7152 5.79758 20.9038 4.90987 17.7965 4.90987C9.65845 4.90987 3 11.5677 3 19.7049C3 27.8422 9.65845 34.5 17.7965 34.5C25.9346 34.5 32.5931 27.8422 32.5931 19.7049C32.5931 16.7459 31.7053 14.0828 30.2256 11.7156L29.1899 12.8992L28.1541 14.0828L19.5721 24.8832C19.2762 25.1791 18.8323 25.475 18.3884 25.475C17.9445 25.475 17.6486 25.3271 17.3527 25.0312L10.9901 18.2254C10.5462 17.7816 10.5462 17.0418 10.6942 16.598C10.6942 16.45 10.8422 16.3021 10.9901 16.1541C11.582 15.5623 12.4698 15.5623 13.0617 16.1541L18.2404 21.7762L26.3785 11.5677L27.2663 10.384L28.1541 9.20044L32.4451 3.87422C33.185 3.28242 33.185 2.39471 32.4451 1.80291Z" /></svg>';

            label.appendChild(location_name);
            label.appendChild(location_city);
            location.appendChild(label);
            location.appendChild(icon);
            weather_view.appendChild(location);

            weatherLocation.DOM = { location, label, location_name, location_city, icon };
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
        if (weatherLocationData.location.includes(filter) || weatherLocationData.city.includes(filter)) weatherLocationData.DOM.location.style.display = 'block';
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