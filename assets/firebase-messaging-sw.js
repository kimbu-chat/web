/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

const config = {
  apiKey: 'AIzaSyBndllDIwxwEq0S4Dls5pNVslmJIgmfO4o',
  projectId: 'kimbu-3d936',
  messagingSenderId: '104186841570',
  appId: '1:104186841570:web:d96d94528e19aa12d5d1bb',
};

firebase.initializeApp(config);

firebase.messaging();
