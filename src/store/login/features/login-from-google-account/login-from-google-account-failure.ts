import { createAction } from '@reduxjs/toolkit';

import { ILoginState } from '@store/login/login-state';

export class LoginFromGoogleAccountFailure {
  static get action() {
    return createAction('LOGIN_FROM_GOOGLE_ACCOUNT_FAILURE');
  }

  static get reducer() {
    return (draft: ILoginState) => {
      draft.googleAuthLoading = false;
      draft.googleAuthIdToken = undefined;
      return draft;
    };
  }
}
