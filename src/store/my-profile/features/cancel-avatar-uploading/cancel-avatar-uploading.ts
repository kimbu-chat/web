import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import {
  getAvatarUploadCancelTokenSource,
  setAvatarUploadCancelTokenSource,
} from '@store/my-profile/my-profile-utils';

export class CancelAvatarUploading {
  static get action() {
    return createAction('CANCEL_AVATAR_UPLOADING');
  }

  static get saga() {
    return function* cancelAvatarUploadingSaga(): SagaIterator {
      const tokenSource = yield call(getAvatarUploadCancelTokenSource);
      tokenSource?.cancel();
      yield call(setAvatarUploadCancelTokenSource, undefined);
    };
  }
}

