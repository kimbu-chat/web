import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { messaging } from '../../../middlewares/firebase/firebase';

export async function getPushNotificationTokens() {
  async function retrieveApplicationToken() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
        const tokenId: string | undefined = await messaging?.getToken({ serviceWorkerRegistration: registration });
        if (tokenId) {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          const deviceId: string = result.visitorId;
          return { tokenId, deviceId };
        }
        return undefined;
      } catch {
        return undefined;
      }
    }

    return undefined;
  }

  if (Notification.permission === 'denied' || Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    const tokens = await retrieveApplicationToken();
    return tokens;
  }

  return undefined;
}
