import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { IDismissToAddContact } from './api-requests/dismiss-to-add-contact-api-request';
import { DismissToAddContactSuccess } from './dismiss-to-add-contact-success';

export class DismissToAddContact {
  static get action() {
    return createAction('DISMISS_TO_ADD_CONTACT')<number, Meta>();
  }

  static get saga() {
    return function* addFriend(
      action: ReturnType<typeof DismissToAddContact.action>,
    ): SagaIterator {
      const userId = action.payload;

      const phoneToAdd: IDismissToAddContact = { userInterlocutorId: userId };
      yield call(() => DismissToAddContact.httpRequest.generator(phoneToAdd));

      yield put(DismissToAddContactSuccess.action(userId));
      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDismissToAddContact>(
      `${process.env.REACT_APP_MAIN_API}/api/chats/dismiss-add-to-contacts`,
      HttpRequestMethod.Post,
    );
  }
}
