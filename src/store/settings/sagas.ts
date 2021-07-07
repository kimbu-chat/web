import { all, takeLatest, takeLeading } from 'redux-saga/effects';

import { BlockUser } from './features/block-user/block-user';
import { ChangeFontSize } from './features/change-font-size/change-font-size';
import { ChangeLanguage } from './features/change-language/change-language';
import { ChangeNotificationSoundState } from './features/change-notification-sound-state/change-notification-sound-state';
import { ChangePushNotificationState } from './features/change-push-notification-state/change-push-notification-state';
import { ChangeTheme } from './features/change-theme/change-theme';
import { ChangeTypingStrategy } from './features/change-typing-strategy/change-typing-strategy';
import { GetBlackList } from './features/get-black-list/get-black-list';
import { GetSessionList } from './features/get-sesion-list/get-sesion-list';
import { GetUserSettingsSuccess } from './features/get-user-settings/get-user-settings-success';
import { GetUserSettings } from './features/get-user-settings/get-user-settings';
import { TerminateSession } from './features/terminate-session/revoke-session';
import { UnblockUser } from './features/unblock-user/unblock-user';

export function* settingsSaga() {
  yield all([
    takeLatest(ChangeLanguage.action, ChangeLanguage.saga),
    takeLatest(ChangeNotificationSoundState.action, ChangeNotificationSoundState.saga),
    takeLatest(ChangeTypingStrategy.action, ChangeTypingStrategy.saga),
    takeLatest(GetUserSettings.action, GetUserSettings.saga),
    takeLatest(GetUserSettingsSuccess.action, GetUserSettingsSuccess.saga),
    takeLatest(ChangeTheme.action, ChangeTheme.saga),
    takeLatest(ChangeFontSize.action, ChangeFontSize.saga),
    takeLeading(ChangePushNotificationState.action, ChangePushNotificationState.saga),
    takeLatest(GetBlackList.action, GetBlackList.saga),
    takeLatest(BlockUser.action, BlockUser.saga),
    takeLatest(UnblockUser.action, UnblockUser.saga),
    takeLatest(GetSessionList.action, GetSessionList.saga),
    takeLatest(TerminateSession.action, TerminateSession.saga),
  ]);
}
