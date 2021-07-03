import { AuthActions } from './auth/actions';
import { CallActions } from './calls/actions';
import { ChatActions } from './chats/actions';
import { FriendActions } from './friends/actions';
import { InternetActions } from './internet/actions';
import { LoginActions } from './login/actions';
import { MyProfileActions } from './my-profile/actions';
import { SettingsActions } from './settings/actions';
import { UsersActions } from './users/actions';
import { WebSocketActions } from './web-sockets/actions';

export default {
  auth: AuthActions,
  chat: ChatActions,
  profile: MyProfileActions,
  friend: FriendActions,
  call: CallActions,
  internet: InternetActions,
  settings: SettingsActions,
  webSocket: WebSocketActions,
  users: UsersActions,
  login: LoginActions,
};
