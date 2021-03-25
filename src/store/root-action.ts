import * as AuthActions from './auth/actions';
import * as ChatActions from './chats/actions';
import * as MyProfileActions from './my-profile/actions';
import * as FriendActions from './friends/actions';
import * as CallActions from './calls/actions';
import * as InternetActions from './internet/actions';
import * as SettingsActions from './settings/actions';
import * as WebSocketActions from './web-sockets/actions';

export default {
  auth: AuthActions,
  chat: ChatActions,
  profile: MyProfileActions,
  friend: FriendActions,
  call: CallActions,
  internet: InternetActions,
  settings: SettingsActions,
  webSocket: WebSocketActions,
};
