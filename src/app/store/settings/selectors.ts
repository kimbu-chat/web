import { RootState } from 'store/root-reducer';

export const getCurrentLanguage = (state: RootState) => state.settings.language;
export const getTypingStrategy = (state: RootState) => state.settings.typingStrategy;
export const areNotificationsEnabled = (state: RootState) => state.settings.notificationSound;
