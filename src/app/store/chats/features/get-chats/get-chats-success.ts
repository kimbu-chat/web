import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';

export class GetChatsSuccess {
  static get action() {
    return createAction('GET_CHATS_SUCCESS')<IGetChatsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChatsSuccess.action>) => {
      const { chats, hasMore, initializedBySearch } = payload;

      draft.loading = false;
      draft.hasMore = hasMore;

      if (initializedBySearch) {
        draft.chats = chats;
      } else {
        draft.chats = unionBy(draft.chats, chats, 'id');
      }

      return draft;
    });
  }
}
