import { produce } from 'immer';
import { createAction } from 'typesafe-actions';
import { CombinedReducerState } from './combined-reducer';

export class UpdateStore {
  static get action() {
    return createAction('UPDATE_STORE')<CombinedReducerState>();
  }

  static get reducer() {
    return produce((_, { payload }: ReturnType<typeof UpdateStore.action>) => payload);
  }
}
