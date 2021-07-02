import { messaging } from '../../../middlewares/firebase/firebase';

export async function getPushNotificationToken(): Promise<string | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  if (Notification.permission === 'denied' || Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    try {
      const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
      const token: string | undefined = await messaging?.getToken({
        serviceWorkerRegistration: registration,
      });
      if (token) {
        return token;
      }
      return null;
    } catch {
      return null;
    }
  }

  return null;
}
