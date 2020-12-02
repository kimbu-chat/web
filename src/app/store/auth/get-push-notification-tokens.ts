import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { messaging } from '../middlewares/firebase/firebase';

export async function getPushNotificationTokens(): Promise<{ tokenId: string; deviceId: string } | undefined> {
  async function retrieveApplicationToken() {
    const tokenId: string = await messaging().getToken();
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const deviceId: string = result.visitorId;
    return Promise.resolve({ tokenId, deviceId });
  }

  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    const tokens = await retrieveApplicationToken();
    return tokens;
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const tokens = await retrieveApplicationToken();
      return tokens;
    }
  }

  return undefined;
}
