import { createAction } from '@reduxjs/toolkit';

import { IUserBlockedIntegrationEvent } from './user-unblocked-integration-event';

export class UserUnBlockedEventHandler {
  static get action() {
    return createAction<IUserBlockedIntegrationEvent>('UserUnBlocked');
  }
}
