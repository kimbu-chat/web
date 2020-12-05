import { createEmptyAction } from 'app/store/common/actions';
import { SagaIterator } from 'redux-saga';
import { avatarUploadCancelTokenSource, setAvatarUploadCancelTokenSource } from '../../my-profile-utils';

export class CancelAvatarUploading {
  static get action() {
    return createEmptyAction('CANCEL_AVATAR_UPLOADING');
  }

  static get saga() {
    return function* cancelAvatarUploadingSaga(): SagaIterator {
      avatarUploadCancelTokenSource?.cancel();
      setAvatarUploadCancelTokenSource(undefined);
    };
  }
}
