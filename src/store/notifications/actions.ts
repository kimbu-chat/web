import { SubscribeToPushNotifications } from './features/subscribe-to-push-notifications/subscribe-to-push-notifications';
import { UnSubscribeFromPushNotifications } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications';
import { UnSubscribeToPushNotificationsSuccess } from './features/un-subscribe-from-push-notifications/un-subscribe-from-push-notifications_success';

/**
 * Notification actions
 * used to subscribe/unsubscribe browser's notifications
 */
export const subscribeToPushNotifications = SubscribeToPushNotifications.action;
export const unSubscribeFromPushNotifications = UnSubscribeFromPushNotifications.action;
export const unSubscribeToPushNotificationsSuccess = UnSubscribeToPushNotificationsSuccess.action;

export const NotificationsActions = {
  subscribeToPushNotifications,
  unSubscribeFromPushNotifications,
  unSubscribeToPushNotificationsSuccess,
};
