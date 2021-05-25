import { AuthActions } from './auth/actions';
import { ChatActions } from './chats/actions';
import { MyProfileActions } from './my-profile/actions';
import { FriendActions } from './friends/actions';
import { CallActions } from './calls/actions';
import { InternetActions } from './internet/actions';
import { SettingsActions } from './settings/actions';
import { WebSocketActions } from './web-sockets/actions';
import { UsersActions } from './users/actions';
import { LoginActions } from './login/actions';

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
