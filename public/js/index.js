import app from '/js/firebase-app.js';
import { getAnalytics, logEvent } from '/js/firebase-analytics.js';
import 'https://bestiejs.github.io/platform.js/vendor/platform-1.3.5.js';

const isDailyPCCU = location.origin.includes('daily-pccu');
var analytics;
if (isDailyPCCU) analytics = getAnalytics(app);

const cover_addFriend_btn = document.getElementById('cover_addFriend_btn');
const nav_addFriend_btn = document.getElementById('nav_addFriend_btn');
const line_btn = document.getElementById('line_btn');

platform.os = String(platform.os);
var new_platform = {};
['name', 'version', 'layout', 'prerelease', 'os', 'manufacturer', 'product', 'description', 'ua'].forEach(key => new_platform[key] = platform[key]);

async function addFriendBtnOnClick(e, btn, btnType) {
    e.preventDefault();
    if (isDailyPCCU) await logEvent(analytics, 'addFriend_btn_click', { btnType });
    document.querySelector(btn.dataset.target).scrollIntoView({ behavior: 'smooth' });
    location.hash = btn.dataset.target.replace('#', '');
    return false;
}

cover_addFriend_btn.addEventListener('click', e => addFriendBtnOnClick(e, cover_addFriend_btn, 'cover'));
nav_addFriend_btn.addEventListener('click', e => addFriendBtnOnClick(e, nav_addFriend_btn, 'nav'));
line_btn.addEventListener('click', async () => {
    if (isDailyPCCU) await logEvent(analytics, 'line_btn_click', new_platform);
    location = line_btn.dataset.href;
});


