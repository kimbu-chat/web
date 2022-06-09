import { createAction } from '@reduxjs/toolkit';

import { IUserRemovedFromBlackListIntegrationEvent } from './user-removed-from-black-list-integration-event';

export class UserRemovedFromBlackListEventHandler {
  static get action() {
    return createAction<IUserRemovedFromBlackListIntegrationEvent>('UserRemovedFromBlackList');
  }
}
