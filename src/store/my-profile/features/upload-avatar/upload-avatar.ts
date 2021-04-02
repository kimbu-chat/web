import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { apply, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { Meta } from '@store/common/actions';
import { HttpRequestMethod } from '@store/common/http';
import { httpFilesRequestFactory } from '@store/common/http/http-file-factory';
import { IAvatar } from '@store/common/models';
import { getFileFromUrl } from '@utils/get-file-from-url';
import { setAvatarUploadCancelTokenSource } from '@store/my-profile/my-profile-utils';

import { IUploadAvatarActionPayload } from './upload-avatar-action-payload';

export class UploadAvatar {
  static get action() {
    return createAction('UPLOAD_AVATAR')<IUploadAvatarActionPayload, Meta<IAvatar>>();
  }

  static get saga() {
    return function* uploadAvatarSaga(
      action: ReturnType<typeof UploadAvatar.action>,
    ): SagaIterator {
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
            yield apply(setAvatarUploadCancelTokenSource, setAvatarUploadCancelTokenSource, [
              cancelTokenSource,
            ]);
          },
          *onSuccess(payload: AxiosResponse<IAvatar>): SagaIterator {
            yield apply(setAvatarUploadCancelTokenSource, setAvatarUploadCancelTokenSource, [
              undefined,
            ]);
            action.meta.deferred.resolve(payload.data);
          },
          *onProgress(payload): SagaIterator {
            if (onProgress) {
              yield apply(onProgress, onProgress, [payload.progress]);
            }
          },
          *onFailure(): SagaIterator {
            yield apply(setAvatarUploadCancelTokenSource, setAvatarUploadCancelTokenSource, [
              undefined,
            ]);
            action.meta.deferred.reject();
          },
        }),
      );
    };
  }

  static get httpRequest() {
    return httpFilesRequestFactory<AxiosResponse<IAvatar>, FormData>(
      `${window.__config.REACT_APP_FILES_API}/api/avatars`,
      HttpRequestMethod.Post,
    );
  }
}
