import { initializeApp } from "firebase/app";

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

export { app };