import { GetMessagesSuccess } from '@store/chats/features/get-messages/get-messages-success';
import produce from 'immer';
import { unionBy } from 'lodash';
import { createReducer } from 'typesafe-actions';
import { IUsersState } from './users-state';

const initialState: IUsersState = {
  users: [],
};

const reducer = createReducer<IUsersState>(initialState).handleAction(
  GetMessagesSuccess.action,
  produce((draft: IUsersState, { payload }: ReturnType<typeof GetMessagesSuccess.action>) => {
    const { users } = payload;

    draft.users = unionBy(draft.users, Object.values(users), 'id');

    return draft;
  }),
);
export default reducer;
