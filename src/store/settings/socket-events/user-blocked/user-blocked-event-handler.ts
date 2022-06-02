import { createAction } from '@reduxjs/toolkit';

import { IUserBlockedIntegrationEvent } from './user-blocked-integration-event';

export class UserBlockedEventHandler {
  static get action() {
    return createAction<IUserBlockedIntegrationEvent>('UserBlocked');
  }
}
