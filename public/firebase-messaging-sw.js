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

messaging.onBackgroundMessage((payload) => {
  const { data } = { ...payload.data };
  const info = fromJson(data);

  if (!info || info.mute) return;

  const notificationData = getNotificationData(info);

  showNotification(notificationData);

  closeNotifications({ chatId: info.chatId, messageId: info.id });
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

function getNotificationData(data) {
  const title = `${data.userCreator.firstName} ${data.userCreator.lastName}`;

  const options = {
    body: getBody(data),
    icon: './kimbu-logo.png',
    data: {
      chatId: data.chatId,
      messageId: data.id,
    },
  };

  return { title, options };
}

function getBody(data) {
  let text;

  if (data.attachments.length > 0 && !data.text) {
    const firstAttachType = data.attachments[0].type;

    switch (firstAttachType.type) {
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

  self.registration.showNotification(title, options);
}

async function closeNotifications({ chatId, messageId }) {
  const notifications = await self.registration.getNotifications();

  notifications.forEach((notification) => {
    if (notification.data.chatId === chatId && notification.data.messageId < messageId) {
      notification.close();
    }
  });
}
