import { getAnalytics as firebase_getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js'

function getAnalytics(app) {
    return firebase_getAnalytics(app);
};

export { logEvent, getAnalytics };