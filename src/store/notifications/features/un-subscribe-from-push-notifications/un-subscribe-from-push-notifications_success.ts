import { createEmptyAction } from '@store/common/actions';

export class UnSubscribeToPushNotificationsSuccess {
  static get action() {
    return createEmptyAction('UN_SUBSCRIBE_TO_PUSH_NOTIFICATIONS_SUCCESS');
  }
}
