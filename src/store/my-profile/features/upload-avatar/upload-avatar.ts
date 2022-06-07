import { AxiosResponse } from 'axios';
import { IAvatar } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { apply, call } from 'redux-saga/effects';

import { FILES_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { HttpRequestMethod } from '@store/common/http';
import { httpFilesRequestFactory } from '@store/common/http/http-file-factory';
import { setAvatarUploadCancelTokenSource } from '@store/my-profile/my-profile-utils';
import { getFileFromUrl } from '@utils/get-file-from-url';

import { IUploadAvatarActionPayload } from './upload-avatar-action-payload';

export class UploadAvatar {
  static get action() {
    return createDeferredAction<IUploadAvatarActionPayload, IAvatar>('UPLOAD_AVATAR');
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
            action.meta?.deferred?.resolve(payload.data);
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
            action.meta?.deferred?.reject();
          },
        }),
      );
    };
  }

  static get httpRequest() {
    return httpFilesRequestFactory<AxiosResponse<IAvatar>, FormData>(
      FILES_API.UPLOAD_AVATAR,
      HttpRequestMethod.Post,
    );
  }
}
