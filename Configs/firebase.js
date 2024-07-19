// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyBpPG-T8FgP3lAXCzvwd_uJ2reR1rdLZhU",

  authDomain: "qwik-talk-a0d04.firebaseapp.com",

  projectId: "qwik-talk-a0d04",

  storageBucket: "qwik-talk-a0d04.appspot.com",

  messagingSenderId: "7295134872",

  appId: "1:7295134872:web:b2ca496e5e5650b05974ed",

  measurementId: "G-NZ1JM5QT1C"

};

  
 

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, firebaseConfig };
