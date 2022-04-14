import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: 'AIzaSyBf0_d04cMXhPuxiK-oj6eVQ0MLqxrDObo',
  projectId: 'kimbu-21a94',
  messagingSenderId: '1016600291611',
  appId: '1:1016600291611:web:5ad726519e8b76ea960bbe',
};

firebase.initializeApp(config);

export const messaging = firebase.messaging.isSupported() ? firebase.messaging() : undefined;
