// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7vMOxhDjlu2fp3vy8aOZVl8sjzsxX0Zo",
  authDomain: "nssweb-3dfea.firebaseapp.com",
  projectId: "nssweb-3dfea",
  storageBucket: "nssweb-3dfea.appspot.com", 
  messagingSenderId: "140147467349",
  appId: "1:140147467349:web:437bac52cd568c464420dc",
  measurementId: "G-SGQDXG0KTK",
  databaseURL: "https://nssweb-3dfea-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 
const auth = getAuth(app);

export { db, storage , auth};
