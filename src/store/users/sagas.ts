import { takeEvery } from 'redux-saga/effects';
import { UserDeactivatedEventHandler } from './socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from './socket-events/user-deleted/user-deleted';
import { UserStatusChangedEventHandler } from './socket-events/user-status-changed/user-status-changed-event-handler';

export const UsersSagas = [
  takeEvery(UserStatusChangedEventHandler.action, UserStatusChangedEventHandler.saga),
  takeEvery(UserDeactivatedEventHandler.action, UserDeactivatedEventHandler.saga),
  takeEvery(UserDeletedEventHandler.action, UserDeletedEventHandler.saga),
];
