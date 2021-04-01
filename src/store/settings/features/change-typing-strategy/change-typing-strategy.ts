import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { apply } from 'redux-saga/effects';
import { IChangeTypingStrategyActionPayload } from './action-payloads/change-typing-strategy-action-payload';

export class ChangeTypingStrategy {
  static get action() {
    return createAction('CHANGE_TYPING_STRATEGY')<IChangeTypingStrategyActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IUserSettings, { payload }: ReturnType<typeof ChangeTypingStrategy.action>) => {
        draft.typingStrategy = payload.strategy;
        return draft;
      },
    );
  }

  static get saga() {
    return function* changeTypingStrategy(
      action: ReturnType<typeof ChangeTypingStrategy.action>,
    ): SagaIterator {
      const settingsService = new SettingsService();
      yield apply(settingsService, settingsService.initializeOrUpdate, [{
        typingStrategy: action.payload.strategy,
      }]);
    };
  }
}
