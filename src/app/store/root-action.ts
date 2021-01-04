import { ActionUnionType } from './common/actions';
import { AuthActions } from './auth/actions';
import { ChatActions } from './chats/actions';
import { MyProfileActions } from './my-profile/actions';
import { FriendActions } from './friends/actions';
import { CallActions } from './calls/actions';
import { InternetActions } from './internet/actions';
import { SettingsActions } from './settings/actions';
import { WebSocketActions } from './sockets/actions';

export type RootAction =
  | ActionUnionType<typeof AuthActions>
  | ActionUnionType<typeof FriendActions>
  | ActionUnionType<typeof ChatActions>
  | ActionUnionType<typeof MyProfileActions>
  | ActionUnionType<typeof CallActions>
  | ActionUnionType<typeof InternetActions>
  | ActionUnionType<typeof SettingsActions>
  | ActionUnionType<typeof WebSocketActions>;
