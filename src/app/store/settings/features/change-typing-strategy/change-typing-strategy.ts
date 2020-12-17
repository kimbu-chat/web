import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SettingsService } from 'app/services/settings-service';
import { SagaIterator } from 'redux-saga';
import { UserSettings } from '../../models';
import { ChangeTypingStrategyActionPayload } from './change-typing-strategy-action-payload';

export class ChangeTypingStrategy {
  static get action() {
    return createAction('CHANGE_TYPING_STRATEGY')<ChangeTypingStrategyActionPayload>();
  }

  static get reducer() {
    return produce((draft: UserSettings, { payload }: ReturnType<typeof ChangeTypingStrategy.action>) => {
      draft.TypingStrategy = payload.strategy;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeTypingStrategy.action>): SagaIterator {
      new SettingsService().initializeOrUpdate({ TypingStrategy: action.payload.strategy });
    };
  }
}
