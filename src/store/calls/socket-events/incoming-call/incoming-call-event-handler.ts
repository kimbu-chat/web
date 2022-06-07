import { createAction } from '@reduxjs/toolkit';
import { IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { apply, put } from 'redux-saga/effects';

import { userSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { setInterlocutorOffer } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';

import { IIncomingCallIntegrationEvent } from './incoming-call-integration-event';

export class IncomingCallEventHandler {
  static get action() {
    return createAction<IIncomingCallIntegrationEvent>('CallOfferSent');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof IncomingCallEventHandler.action>) => {
      draft.isIncomingCallVideoEnbaled = payload.isVideoEnabled;
      const interlocutor = payload.userInterlocutor;
      draft.interlocutorId = interlocutor.id;
      draft.amICalled = true;

      return draft;
    };
  }

  static get saga() {
    return function* incomingCallSaga(
      action: ReturnType<typeof IncomingCallEventHandler.action>,
    ): SagaIterator {
      yield apply(setInterlocutorOffer, setInterlocutorOffer, [action.payload.offer]);

      const {
        entities: { users },
      } = normalize<IUser, { users: Record<number, IUser> }, number[]>(
        action.payload.userInterlocutor,
        userSchema,
      );
      yield put(AddOrUpdateUsers.action({ users }));
    };
  }
}
