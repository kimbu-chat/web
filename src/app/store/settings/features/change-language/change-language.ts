import { SettingsService } from 'app/services/settings-service';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { IUserSettings } from '../../models';
import { IChangeLanguageActionPayload } from './change-language-action-payload';

export class ChangeLanguage {
  static get action() {
    return createAction('CHANGE_LANGUAGE')<IChangeLanguageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof ChangeLanguage.action>) => {
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
