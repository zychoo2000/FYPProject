import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore, initializeFirestore} from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyAU1CImTlpYM3jJ8VnrYECWvghw2CQi2Dw',
  authDomain: 'budgetmanagementsystem-58f67.firebaseapp.com',
  projectId: 'budgetmanagementsystem-58f67',
  storageBucket: 'budgetmanagementsystem-58f67.appspot.com',
  messagingSenderId: '517126307805',
  appId: '1:517126307805:web:5d35edee7a1c52293a4034',
  measurementId: 'G-ZZM9JEXZQB',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// export default getFirestore(app);
export default firestore;
