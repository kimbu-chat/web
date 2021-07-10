import { createAction } from 'typesafe-actions';

import { IUserAddedToBlackListIntegrationEvent } from './user-added-to-black-list-integration-event';

export class UserAddedToBlackListEventHandler {
  static get action() {
    return createAction('UserAddedToBlackList')<IUserAddedToBlackListIntegrationEvent>();
  }
}
