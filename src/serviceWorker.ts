export const registerServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/firebase-messaging-sw.js')
			.then(function (registration) {
				return registration.scope;
			})
			.catch(function (err) {
				return err;
			});
	}
};
