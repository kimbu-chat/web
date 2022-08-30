/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

const config = {
  apiKey: 'AIzaSyBf0_d04cMXhPuxiK-oj6eVQ0MLqxrDObo',
  projectId: 'kimbu-21a94',
  messagingSenderId: '1016600291611',
  appId: '1:1016600291611:web:5ad726519e8b76ea960bbe',
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

firebase.messaging().onBackgroundMessage((payload) => {
  const { data, name } = { ...payload.data };
  const info = fromJson(data);

  if (!info || info.mute) return;

  const notificationData = getNotificationData(info, name);

  showNotification(notificationData);
});

self.addEventListener('notificationclick', (event) => {
  const appUrl = self.registration.scope;

  event.notification.close();

  const notifyClients = async () => {
    const clientsList = await clients.matchAll({
      includeUncontrolled: true,
    });

    if (clientsList.length > 0) {
      await clientsList[0].focus();
      return;
    }

    await self.clients.openWindow(appUrl);
  };

  event.waitUntil(notifyClients());
});

function fromJson(data) {
  return JSON.parse(data);
}

function getNotificationData(data, actionName) {
  const title = getTitle(actionName);

  const options = {
    body: getBody(data),
    icon: './kimbu-logo.png',
  };

  return { title, options };
}

function getTitle(actionName) {
  let title;

  switch (actionName) {
    case 'MessageCreated':
      title = 'New Message';
      break;
    default:
      break;
  }

  return title;
}

function getBody(data) {
  let text;

  if (data.attachments.length > 0 && !data.text) {
    const firstAttachType = data.attachments[0].type;

    switch (firstAttach.type) {
      case 'Picture':
      case 'Raw':
        text = 'Picture';
        break;
      default:
        text = firstAttachType;
        break;
    }
  } else if (!data.attachments.length && !data.text && data.linkedMessageId) {
    text = 'Forwarded message';
  } else {
    text = data.text;
  }

  return text;
}

function showNotification(notificationInfo) {
  const { title, options } = notificationInfo;

  return self.registration.showNotification(title, options);
}
