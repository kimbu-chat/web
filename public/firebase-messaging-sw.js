/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

const config = {
  apiKey: 'AIzaSyBndllDIwxwEq0S4Dls5pNVslmJIgmfO4o',
  projectId: 'kimbu-3d936',
  messagingSenderId: '104186841570',
  appId: '1:104186841570:web:d96d94528e19aa12d5d1bb',
};

self.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      }),
  );
});

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Message received. ', payload.data);
});
