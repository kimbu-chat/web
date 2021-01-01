import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { IUserSettings } from '../../models';
import { IChangeTypingStrategyActionPayload } from './change-typing-strategy-action-payload';

export class ChangeTypingStrategy {
  static get action() {
    return createAction('CHANGE_TYPING_STRATEGY')<IChangeTypingStrategyActionPayload>();
  }

  static get reducer() {
    return produce((draft: IUserSettings, { payload }: ReturnType<typeof ChangeTypingStrategy.action>) => {
      draft.typingStrategy = payload.strategy;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeTypingStrategy.action>): SagaIterator {
      new SettingsService().initializeOrUpdate({ typingStrategy: action.payload.strategy });
    };
  }
}
