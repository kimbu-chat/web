export const registerServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('firebase-messaging-swaa.js', { scope: './assets/' })
			.then(function (registration) {
				// eslint-disable-next-line no-console
				console.log('[SW]: SCOPE: ', registration.scope);
				return registration.scope;
			})
			.catch(function (err) {
				return err;
			});
	}
};
