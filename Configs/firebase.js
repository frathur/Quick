// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSiEYI_2xToq-BTkD4dkiTKug0UT1XkYo",
    authDomain: "quicktalk-67276.firebaseapp.com",
    projectId: "quicktalk-67276",
    storageBucket: "quicktalk-67276.appspot.com",
    messagingSenderId: "1080942447660",
    appId: "1:1080942447660:web:5b7e91cd89f96a80c99589",
    measurementId: "G-FXL949G2JR"
  };
  
 

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, firebaseConfig };
