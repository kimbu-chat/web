import { produce } from 'immer';
import { createAction } from 'typesafe-actions';
import { RootState } from './root-reducer';

export class SetStore {
  static get action() {
    return createAction('SET_STORE')<RootState>();
  }

  static get reducer() {
    return produce((draft: RootState, { payload }: ReturnType<typeof SetStore.action>) => {
      draft = payload;
      return draft;
    });
  }
}
