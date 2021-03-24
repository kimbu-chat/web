import { RootState } from 'typesafe-actions';

export const getCurrentLanguageSelector = (state: RootState) => state.settings.language;
export const getTypingStrategySelector = (state: RootState) => state.settings.typingStrategy;
export const getCurrentThemeSelector = (state: RootState) => state.settings.theme;
export const getCurrentFontSizeSelector = (state: RootState) => state.settings.fontSize;
export const areNotificationsEnabledSelector = (state: RootState) => state.settings.notificationSound;
