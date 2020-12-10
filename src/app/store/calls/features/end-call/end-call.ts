import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { peerConnection, resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { UserPreview } from 'app/store/my-profile/models';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { EndCallApiRequest } from '../../models';
import { videoSender, setVideoSender, stopAllTracks } from '../../utils/user-media';
import { CancelCallSuccess } from '../cancel-call/cancel-call-success';
import { EndCallActionPayload } from './end-call-action-payload';

export class EndCall {
  static get action() {
    return createAction('END_CALL')<EndCallActionPayload>();
  }

  static get saga() {
    return function* endCallSaga(action: ReturnType<typeof EndCall.action>): SagaIterator {
      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
      const myProfile: UserPreview = yield select(getMyProfileSelector);
      const myId = myProfile.id;
      const isActiveCallIncoming: boolean = yield select((state: RootState) => state.calls.isActiveCallIncoming);

      const request = {
        callerId: isActiveCallIncoming ? interlocutorId : myId,
        calleeId: isActiveCallIncoming ? myId : interlocutorId,
        seconds: action.payload.seconds,
      };

      EndCall.httpRequest.call(yield call(() => EndCall.httpRequest.generator(request)));

      if (videoSender) {
        try {
          peerConnection?.removeTrack(videoSender);
        } catch (e) {
          console.warn(e);
        }

        setVideoSender(null);
      }

      peerConnection?.close();
      resetPeerConnection();

      stopAllTracks();

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, EndCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/end-call`, HttpRequestMethod.Post);
  }
}
