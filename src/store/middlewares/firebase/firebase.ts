import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: 'AIzaSyBndllDIwxwEq0S4Dls5pNVslmJIgmfO4o',
  projectId: 'kimbu-3d936',
  messagingSenderId: '104186841570',
  appId: '1:104186841570:web:d96d94528e19aa12d5d1bb',
};

firebase.initializeApp(config);

export const messaging = firebase.messaging.isSupported() ? firebase.messaging() : undefined;