// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBRbdJo0tryO2zdviQqvpbRH5qd8CzYpB0",

  authDomain: "rando-f6bc2.firebaseapp.com",

  projectId: "rando-f6bc2",

  storageBucket: "rando-f6bc2.appspot.com",

  messagingSenderId: "964430577414",

  appId: "1:964430577414:web:43cbaf6a01a558f58a6887",

  measurementId: "G-WJHHZKX9L5"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);



const auth = getAuth(app);

const analytics = getAnalytics(app);

export { auth, analytics };