import { SagaIterator } from 'redux-saga';

import { createEmptyAction } from '@store/common/actions';
import { getAvatarUploadCancelTokenSource, setAvatarUploadCancelTokenSource } from '@store/my-profile/my-profile-utils';

export class CancelAvatarUploading {
  static get action() {
    return createEmptyAction('CANCEL_AVATAR_UPLOADING');
  }

  static get saga() {
    return function* cancelAvatarUploadingSaga(): SagaIterator {
      const tokenSource = getAvatarUploadCancelTokenSource();
      tokenSource?.cancel();
      setAvatarUploadCancelTokenSource(undefined);
    };
  }
}
