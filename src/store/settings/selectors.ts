import { RootState } from "..";

export const getCurrentLanguageSelector = (state: RootState) => state.settings.language;
export const getTypingStrategySelector = (state: RootState) => state.settings.typingStrategy;
export const getCurrentThemeSelector = (state: RootState) => state.settings.theme;
export const getCurrentFontSizeSelector = (state: RootState) => state.settings.fontSize;
export const areNotificationsEnabledSelector = (state: RootState) =>
  state.settings.notificationSound;
export const arePushNotificationsEnabledSelector = (state: RootState) =>
  state.settings.pushNotificationsEnabled;
export const getBlockedUsersSelector = (state: RootState) => state.settings.blackList.users;
export const getBlockedUsersLoadingSelector = (state: RootState) =>
  state.settings.blackList.isLoading;
export const getSessionsSelector = (state: RootState) => state.settings.sessionList.sessions;
export const getSessionsLoadingSelector = (state: RootState) =>
  state.settings.sessionList.isLoading;
