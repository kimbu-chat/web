import { Meta } from 'app/store/common/actions';
import { createAction } from 'typesafe-actions';
import { UploadAvatarReqData } from '../models';

export class UploadAvatar {
  static get action() {
    return createAction('UPLOAD_AVATAR')<UploadAvatarReqData, Meta>();
  }
}
