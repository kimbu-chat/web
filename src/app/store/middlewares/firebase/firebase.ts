import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: 'AIzaSyBndllDIwxwEq0S4Dls5pNVslmJIgmfO4o',
  authDomain: 'kimbu-3d936.firebaseapp.com',
  databaseURL: 'https://kimbu-3d936.firebaseio.com',
  projectId: 'kimbu-3d936',
  storageBucket: 'kimbu-3d936.appspot.com',
  messagingSenderId: '104186841570',
  appId: '1:104186841570:web:d96d94528e19aa12d5d1bb',
};

firebase.initializeApp(config);
export const messaging = firebase.messaging();
