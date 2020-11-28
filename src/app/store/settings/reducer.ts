import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { SettingsActions } from './actions';
import { Langs, TypingStrategy, UserSettings } from './models';

const initialState: UserSettings = {
  language: navigator.language.includes('ru') ? Langs.ru : Langs.en,
  TypingStrategy: TypingStrategy.nlce,
  notificationSound: false,
};

const settings = createReducer<UserSettings>(initialState)
  .handleAction(
    SettingsActions.getUserSettingsSuccessAction,
    produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.getUserSettingsSuccessAction>) => ({
      ...draft,
      ...payload,
    })),
  )
  .handleAction(
    SettingsActions.changeLanguageAction,
    produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.changeLanguageAction>) => {
      draft.language = payload.language;
      return draft;
    }),
  )
  .handleAction(
    SettingsActions.changeNotificationsSoundStateAction,
    produce((draft: UserSettings) => {
      draft.notificationSound = !draft.notificationSound;
      return draft;
    }),
  )
  .handleAction(
    SettingsActions.changeTypingStrategyAction,
    produce((draft: UserSettings, { payload }: ReturnType<typeof SettingsActions.changeTypingStrategyAction>) => {
      draft.TypingStrategy = payload.strategy;
      return draft;
    }),
  );

export default settings;
