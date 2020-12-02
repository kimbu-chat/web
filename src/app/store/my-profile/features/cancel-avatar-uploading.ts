import { createEmptyAction } from 'app/store/common/actions';

export class CancelAvatarUploading {
  static get action() {
    return createEmptyAction('CANCEL_AVATAR_UPLOADING');
  }
}
