import { SettingsService } from 'app/services/settings-service';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { UserSettings } from '../../models';
import { ChangeLanguageActionPayload } from './change-language-action-payload';

export class ChangeLanguage {
  static get action() {
    return createAction('CHANGE_LANGUAGE')<ChangeLanguageActionPayload>();
  }

  static get reducer() {
    return produce(function (draft: UserSettings, { payload }: ReturnType<typeof ChangeLanguage.action>) {
      draft.language = payload.language;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeLanguage.action>): SagaIterator {
      new SettingsService().initializeOrUpdate({ language: action.payload.language });
    };
  }
}
