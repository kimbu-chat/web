import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { messaging } from '../middlewares/firebase/firebase';

export async function getPushNotificationTokens() {
  async function retrieveApplicationToken() {
    const tokenId: string = await messaging.getToken();
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const deviceId: string = result.visitorId;
    return { tokenId, deviceId };
  }

  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }

  console.log('CALEEEEED');

  if (Notification.permission === 'denied' || Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    const tokens = await retrieveApplicationToken();
    return tokens;
  }

  return undefined;
}
