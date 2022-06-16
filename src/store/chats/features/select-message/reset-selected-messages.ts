import { createAction } from '@reduxjs/toolkit';

import { IChatsState } from '../../chats-state';

export class ResetSelectedMessages {
  static get action() {
    return createAction('RESET_SELECTED_MESSAGES');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      draft.selectedMessageIds = [];

      return draft;
    };
  }
}
