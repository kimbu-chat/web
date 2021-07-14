import { createAction } from 'typesafe-actions';

import { IUserBlockedIntegrationEvent } from './user-unblocked-integration-event';

export class UserUnBlockedEventHandler {
  static get action() {
    return createAction('UserUnBlocked')<IUserBlockedIntegrationEvent>();
  }
}
