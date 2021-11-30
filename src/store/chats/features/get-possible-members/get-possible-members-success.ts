import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

import { IPossibleChatMembersSuccessActionPayload } from './action-payloads/get-possible-members-success-action-payload';

export class GetPossibleMembersSuccess {
  static get action() {
    return createAction(
      'GET_POSSIBLE_CHAT_MEMBERS_SUCCESS',
    )<IPossibleChatMembersSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetPossibleMembersSuccess.action>) => {
        const { chatId, data, hasMore } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.possibleMembers.hasMore = hasMore;
          chat.possibleMembers.loading = false;
          chat.possibleMembers.data = data;
        }

        return draft;
      },
    );
  }
}
