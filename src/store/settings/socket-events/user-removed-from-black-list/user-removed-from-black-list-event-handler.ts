import { createAction } from 'typesafe-actions';

import { IUserRemovedFromBlackListIntegrationEvent } from './user-removed-from-black-list-integration-event';

export class UserRemovedFromBlackListEventHandler {
  static get action() {
    return createAction('UserRemovedFromBlackList')<IUserRemovedFromBlackListIntegrationEvent>();
  }
}
