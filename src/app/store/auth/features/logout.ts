import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createEmptyAction } from '../../common/actions';
import { messaging } from '../../middlewares/firebase/firebase';
import { getPushNotificationTokens } from '../get-push-notification-tokens';
import { AuthHttpRequests } from '../http-requests';

export class Logout {
  static get action() {
    return createEmptyAction('LOGOUT');
  }

  static get saga() {
    return function* (): SagaIterator {
      new AuthService().clear();
      new MyProfileService().clear();

      const tokens = yield call(getPushNotificationTokens);
      const httpRequest = AuthHttpRequests.unsubscribeFromPushNotifications;
      yield call(() => httpRequest.generator(tokens));

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister();
            });
          })
          .catch((err) => {
            console.log('Service Worker registration failed: ', err);
          });
      }

      yield call(async () => await messaging().deleteToken());
    };
  }
}
