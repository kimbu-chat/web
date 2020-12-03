import { GetGroupChatUsersSuccessActionData } from 'app/store/friends/models';
import { createAction } from 'typesafe-actions';

export class GetGroupChatUsersSuccess {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS_SUCCESS')<GetGroupChatUsersSuccessActionData>();
  }
}
