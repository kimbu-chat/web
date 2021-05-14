import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { createEmptyAction } from '@store/common/actions';
import {
  getAvatarUploadCancelTokenSource,
  setAvatarUploadCancelTokenSource,
} from '@store/my-profile/my-profile-utils';

export class CancelAvatarUploading {
  static get action() {
    return createEmptyAction('CANCEL_AVATAR_UPLOADING');
  }

  static get saga() {
    return function* cancelAvatarUploadingSaga(): SagaIterator {
      const tokenSource = yield call(getAvatarUploadCancelTokenSource);
      tokenSource?.cancel();
      yield call(setAvatarUploadCancelTokenSource, undefined);
    };
  }
}
