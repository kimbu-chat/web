import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { SettingsService } from '@services/settings-service';
import { IUserSettings } from '@store/settings/user-settings-state';

import { IChangeTypingStrategyActionPayload } from './action-payloads/change-typing-strategy-action-payload';

export class ChangeTypingStrategy {
  static get action() {
    return createAction<IChangeTypingStrategyActionPayload>('CHANGE_TYPING_STRATEGY');
  }

  static get reducer() {
    return (draft: IUserSettings, { payload }: ReturnType<typeof ChangeTypingStrategy.action>) => {
      draft.typingStrategy = payload.strategy;
      return draft;
    };
  }

  static get saga() {
    return function* changeTypingStrategy(
      action: ReturnType<typeof ChangeTypingStrategy.action>,
    ): SagaIterator {
      const settingsService = new SettingsService();
      yield apply(settingsService, settingsService.initializeOrUpdate, [
        {
          typingStrategy: action.payload.strategy,
        },
      ]);
    };
  }
}
