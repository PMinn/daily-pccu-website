import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyCGQ0tYppWFJkuSxBhOpkH0xVDmX245Vdc",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "637908496727",
    appId: "2:637908496727:web:a4284b4c99e329d5",
    measurementId: "G-9VP01NDSXJ"
});
let analytics;
let firestore;
if (typeof window != undefined) {
    analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
    firestore = getFirestore(app);
}
export { app, analytics, firestore };