import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCPq-VtQask8BdUmwojqfp4tq_WbkTlbEw",
    authDomain: "daily-pccu.firebaseapp.com",
    databaseURL: "https://daily-pccu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "daily-pccu",
    storageBucket: "daily-pccu.appspot.com",
    messagingSenderId: "805313945825",
    appId: "1:805313945825:web:a966b8c9d9902dbca417a0",
    measurementId: "G-FV6BTQPGNN"
};

const app = initializeApp(firebaseConfig);
let analytics;
let firestore;
let database;
if (typeof window != undefined) {
    analytics = isSupported().then(yes => yes ? getAnalytics : null);
    firestore = getFirestore(app);
    database = getDatabase(app);
}
export { app, analytics, firestore, database };