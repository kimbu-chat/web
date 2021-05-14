import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { normalize } from 'normalizr';

import { userNormalizationSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { ById } from '@store/chats/models/by-id';

import { setInterlocutorOffer } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import { IUser } from '../../../common/models';

import { IIncomingCallIntegrationEvent } from './incoming-call-integration-event';

export class IncomingCallEventHandler {
  static get action() {
    return createAction('CallOfferSent')<IIncomingCallIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: ICallsState, { payload }: ReturnType<typeof IncomingCallEventHandler.action>) => {
        draft.isIncomingCallVideoEnbaled = payload.isVideoEnabled;
        const interlocutor = payload.userInterlocutor;
        draft.interlocutorId = interlocutor.id;
        draft.amICalled = true;

        return draft;
      },
    );
  }

  static get saga() {
    return function* incomingCallSaga(
      action: ReturnType<typeof IncomingCallEventHandler.action>,
    ): SagaIterator {
      yield apply(setInterlocutorOffer, setInterlocutorOffer, [action.payload.offer]);

      const {
        entities: { users },
      } = normalize<IUser, { users: ById<IUser> }, number[]>(
        action.payload.userInterlocutor,
        userNormalizationSchema,
      );
      yield put(AddOrUpdateUsers.action({ users }));
    };
  }
}
