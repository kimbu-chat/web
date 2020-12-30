import { Meta } from 'app/store/common/actions';
import { httpFilesRequestFactory } from 'app/store/common/http-file-factory';
import { HttpRequestMethod } from 'app/store/common/models';

import { getFileFromUrl } from 'app/utils/get-file-from-url';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IUploadAvatarResponse } from '../../models';
import { setAvatarUploadCancelTokenSource } from '../../my-profile-utils';
import { IUploadAvatarActionPayload } from './upload-avatar-action-payload';

export class UploadAvatar {
  static get action() {
    return createAction('UPLOAD_AVATAR')<IUploadAvatarActionPayload, Meta>();
  }

  static get saga() {
    return function* uploadAvatarSaga(action: ReturnType<typeof UploadAvatar.action>): SagaIterator {
      const { pathToFile, onProgress } = action.payload;

      const file = yield call(getFileFromUrl, pathToFile);

      const data = new FormData();

      const uploadData = { file };

      Object.entries(uploadData).forEach((k) => {
        data.append(k[0], k[1]);
      });

      yield call(() =>
        UploadAvatar.httpRequest.generator(data, {
          *onStart({ cancelTokenSource }): SagaIterator {
            setAvatarUploadCancelTokenSource(cancelTokenSource);
          },
          *onSuccess(payload: IUploadAvatarResponse): SagaIterator {
            setAvatarUploadCancelTokenSource(undefined);
            action.meta.deferred.resolve(payload);
          },
          *onProgress(payload): SagaIterator {
            if (onProgress) {
              onProgress(payload.progress);
            }
          },
          *onFailure(): SagaIterator {
            setAvatarUploadCancelTokenSource(undefined);
            action.meta.deferred.reject();
          },
        }),
      );
    };
  }

  static get httpRequest() {
    return httpFilesRequestFactory<AxiosResponse<IUploadAvatarResponse>, FormData>(`${process.env.FILES_API}/api/avatars`, HttpRequestMethod.Post);
  }
}
