import { createAction } from 'typesafe-actions';

import { IUserBlockedIntegrationEvent } from './user-blocked-integration-event';

export class UserBlockedEventHandler {
  static get action() {
    return createAction('UserBlocked')<IUserBlockedIntegrationEvent>();
  }
}
