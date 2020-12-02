import { takeLatest } from 'redux-saga/effects';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { messaging } from '../middlewares/firebase/firebase';
import { Logout } from './features/logout';
import { ConfirmPhone } from './features/confirm-phone';
import { RefreshToken } from './features/refresh-token';
import { SendSmsCode } from './features/send-sms-code';

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

export const AuthSagas = [
  takeLatest(Logout.action, Logout.saga),
  takeLatest(RefreshToken.action, RefreshToken.saga),
  takeLatest(ConfirmPhone.action, ConfirmPhone.saga),
  takeLatest(SendSmsCode.action, SendSmsCode.saga),
];
