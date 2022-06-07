import { AuthActions } from './auth/actions';
import { CallActions } from './calls/actions';
import { ChatActions } from './chats/actions';
import { FriendActions } from './friends/actions';
import { InternetActions } from './internet/actions';
import { LoginActions } from './login/actions';
import { MyProfileActions } from './my-profile/actions';
import { NotificationsActions } from './notifications/actions';
import { SettingsActions } from './settings/actions';
import { UsersActions } from './users/actions';
import { WebSocketActions } from './web-sockets/actions';

export type AppRootAction = AuthActions &
      ChatActions &
      MyProfileActions &
      FriendActions &
      CallActions &
      InternetActions &
      SettingsActions &
      WebSocketActions &
      UsersActions &
      LoginActions &
      NotificationsActions

