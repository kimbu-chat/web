import { AxiosResponse } from 'axios';
import { IChangeUserPhoneNumberRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory } from '@store/common/http';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { ConfirmPhone } from '@store/login/features/confirm-phone/confirm-phone';
import { myProfileSelector } from '@store/my-profile/selectors';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { IConfirmChangePhoneActionPayload } from './action-payloads/confirm-change-phone-action-payload';

export class ConfirmChangePhone {
  static get action() {
    return createAction('CONFIRM_CHANGE_PHONE')<IConfirmChangePhoneActionPayload, Meta>();
  }

  static get saga() {
    return function* confirmChangePhone(
      action: ReturnType<typeof ConfirmChangePhone.action>,
    ): SagaIterator {
      const { status: verifyStatus, data: verifyData } = ConfirmPhone.httpRequest.call(
        yield call(() =>
          ConfirmPhone.httpRequest.generator({
            code: action.payload.confirmationCode,
            phoneNumber: action.payload.phoneNumber,
          }),
        ),
      );

      if (
        verifyStatus !== HTTPStatusCode.OK ||
        verifyData.userExists ||
        !verifyData.isCodeCorrect
      ) {
        action?.meta.deferred.reject();
        return;
      }

      const { status: changeStatus } = yield call(() =>
        ConfirmChangePhone.httpRequest.generator({
          ...action.payload,
          phoneNumber: action.payload.phoneNumber,
        }),
      );

      if (changeStatus !== HTTPStatusCode.OK) {
        action?.meta.deferred.reject();
        return;
      }

      const myProfile = yield select(myProfileSelector);

      if (myProfile) {
        const updatedProfile = {
          ...myProfile,
          phoneNumber: action.payload.phoneNumber,
        };
        yield put(AddOrUpdateUsers.action({ users: { [updatedProfile.id]: updatedProfile } }));
      }

      action?.meta.deferred.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeUserPhoneNumberRequest>(
      MAIN_API.CHANGE_PHONE,
      HttpRequestMethod.Put,
    );
  }
}
