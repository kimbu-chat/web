self.addEventListener('notificationclick', (event) => {
	console.log('notificationClick');
	event.waitUntil(async function () {
		console.log('notificationClick');
		const allClients = await clients.matchAll({
			includeUncontrolled: true,
		});
		let chatClient;
		let appUrl = 'xyz';
		for (const client of allClients) {
			//here appUrl is the application url, we are checking it application tab is open
			if (client['url'].indexOf(appUrl) >= 0) {
				client.focus();
				chatClient = client;
				break;
			}
		}
		if (!chatClient) {
			chatClient = await clients.openWindow(appUrl);
		}
	});
});

importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

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
const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function (payload) {
// 	console.log('[firebase-messaging-sw.js] Received background message ', payload);
// 	// Customize notification here
// 	const notificationTitle = 'Background Message Title';
// 	const notificationOptions = {
// 		body: 'Background Message body.',
// 		icon: '/firebase-logo.png',
// 	};

// 	return self.registration.showNotification(notificationTitle, notificationOptions);
// });
