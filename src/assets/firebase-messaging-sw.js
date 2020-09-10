importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

const config = {
	apiKey: 'API-KEY',
	authDomain: 'AUTH-DOMAIN',
	databaseURL: 'DATABASE-URL',
	projectId: 'PROJECT-ID',
	storageBucket: 'STORAGE-BUCKET',
	messagingSenderId: 'MESSAGING-SENDER-ID',
	appId: 'APP-ID',
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	const notificationTitle = payload.data.title;
	const notificationOptions = {
		body: payload.data.body,
		icon: '/firebase-logo.png',
	};

	//@ts-ignore
	return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
	console.log(event);
	return event;
});
