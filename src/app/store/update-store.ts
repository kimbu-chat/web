import { produce } from 'immer';
import { createAction } from 'typesafe-actions';
import { RootState } from 'store/root-reducer';

export class UpdateStore {
  static get action() {
    return createAction('UPDATE_STORE')<RootState>();
  }

  static get reducer() {
    return produce((draft: RootState, { payload }: ReturnType<typeof UpdateStore.action>) => {
      draft = payload;
      return draft;
    });
  }
}
