// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyDRNKx_zuT07bA5Z6TduMOT4KpaiQcI_NY',
  authDomain: 'ambuserve.firebaseapp.com',
  databaseURL:
    'https://ambuserve-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ambuserve',
  storageBucket: 'ambuserve.appspot.com',
  messagingSenderId: '828596412871',
  appId: '1:828596412871:web:79f6c4eef3709cdcb2f9e2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
