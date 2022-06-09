import { createAction } from '@reduxjs/toolkit';

import { IUserAddedToBlackListIntegrationEvent } from './user-added-to-black-list-integration-event';

export class UserAddedToBlackListEventHandler {
  static get action() {
    return createAction<IUserAddedToBlackListIntegrationEvent>('UserAddedToBlackList');
  }
}
