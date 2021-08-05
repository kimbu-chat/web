import { AxiosResponse } from 'axios';
import { IDismissAddToContactsCommand } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { DismissToAddContactSuccess } from './dismiss-to-add-contact-success';

export class DismissToAddContact {
  static get action() {
    return createAction('DISMISS_TO_ADD_CONTACT')<number, Meta>();
  }

  static get saga() {
    return function* dismissToAddContactSaga(
      action: ReturnType<typeof DismissToAddContact.action>,
    ): SagaIterator {
      const userId = action.payload;

      const phoneToAdd: IDismissAddToContactsCommand = { userInterlocutorId: userId };
      yield call(() => DismissToAddContact.httpRequest.generator(phoneToAdd));

      yield put(DismissToAddContactSuccess.action(userId));
      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDismissAddToContactsCommand>(
      MAIN_API.DISMISS_CONTACT,
      HttpRequestMethod.Post,
    );
  }
}
