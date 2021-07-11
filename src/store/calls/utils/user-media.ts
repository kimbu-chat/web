import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { getPeerConnection } from '../../middlewares/webRTC/peerConnectionFactory';
import { CloseScreenShareStatus } from '../features/change-screen-share-status/close-screen-share-status';
import { OpenScreenShareStatus } from '../features/change-screen-share-status/open-screen-share-status';
import { CloseAudioStatus } from '../features/change-user-media-status/close-audio-status';
import { CloseVideoStatus } from '../features/change-user-media-status/close-video-status';
import { OpenAudioStatus } from '../features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from '../features/change-user-media-status/open-video-status';
import {
  doIhaveCallSelector,
  getAudioConstraintsSelector,
  getVideoConstraintsSelector,
  amICallingSelector,
  getIsAcceptCallPendingSelector,
} from '../selectors';

interface IInCompleteConstraints {
  video?: {
    isOpened: boolean;
    width?: { min: number; ideal: number; max: number };
    height?: { min: number; ideal: number; max: number };
    deviceId?: string;
  };
  audio?: {
    isOpened: boolean;
    deviceId?: string;
  };
}

export const tracks: {
  videoTrack: MediaStreamTrack | null;
  audioTrack: MediaStreamTrack | null;
  screenSharingTrack: MediaStreamTrack | null;
} = { videoTrack: null, audioTrack: null, screenSharingTrack: null };

let interlocutorVideoTrack: MediaStreamTrack | null;
let interlocutorAudioTrack: MediaStreamTrack | null;
let videoSender: RTCRtpSender | null;
let audioSender: RTCRtpSender | null;

export function getInterlocutorVideoTrack(): MediaStreamTrack | null {
  return interlocutorVideoTrack;
}

export function getInterlocutorAudioTrack(): MediaStreamTrack | null {
  return interlocutorAudioTrack;
}

export function getVideoSender(): RTCRtpSender | null {
  return videoSender;
}

export function getAudioSender(): RTCRtpSender | null {
  return audioSender;
}

export const assignInterlocutorVideoTrack = (track: MediaStreamTrack | null) => {
  interlocutorVideoTrack = track;
};

export const assignInterlocutorAudioTrack = (track: MediaStreamTrack | null) => {
  interlocutorAudioTrack = track;
};

export const setVideoSender = (sender: RTCRtpSender | null) => {
  videoSender = sender;
};

export function* assignAudioStreams(stream: MediaStream): SagaIterator {
  [tracks.audioTrack] = stream.getAudioTracks();

  const callActive = yield select(doIhaveCallSelector);
  const outgoingCallActive = yield select(amICallingSelector);
  const acceptCallPending = yield select(getIsAcceptCallPendingSelector);

  if (!(callActive || outgoingCallActive || acceptCallPending)) {
    stopAllTracks();
    return;
  }

  if (tracks.audioTrack) {
    yield put(OpenAudioStatus.action(tracks.audioTrack.getCapabilities().deviceId));
  }
}

export function* assignVideoStreams(stream: MediaStream): SagaIterator {
  [tracks.videoTrack] = stream.getVideoTracks();

  const callActive = yield select(doIhaveCallSelector);
  const outgoingCallActive = yield select(amICallingSelector);
  const acceptCallPending = yield select(getIsAcceptCallPendingSelector);

  if (!(callActive || outgoingCallActive || acceptCallPending)) {
    stopAllTracks();
    return;
  }

  if (tracks.videoTrack) {
    yield put(OpenVideoStatus.action(tracks.videoTrack.getCapabilities().deviceId));
  }
}

function* assignScreenSharingTracks(stream: MediaStream): SagaIterator {
  [tracks.screenSharingTrack] = stream.getTracks();

  const callActive = yield select(doIhaveCallSelector);
  const outgoingCallActive = yield select(amICallingSelector);
  const acceptCallPending = yield select(getIsAcceptCallPendingSelector);

  if (!(callActive || outgoingCallActive || acceptCallPending)) {
    stopAllTracks();
  }
}

export function* assignStreams(stream: MediaStream) {
  [tracks.videoTrack] = stream.getVideoTracks();
  if (tracks.videoTrack) {
    yield put(CloseVideoStatus.action());
    yield put(OpenVideoStatus.action(tracks.videoTrack.getCapabilities().deviceId));
  }

  [tracks.audioTrack] = stream.getAudioTracks();

  if (tracks.audioTrack) {
    yield put(OpenAudioStatus.action(tracks.audioTrack.getCapabilities().deviceId));
  }
}

export const stopVideoTracks = () => {
  tracks.videoTrack?.stop();

  tracks.videoTrack = null;
};

export const stopAudioTracks = () => {
  tracks.audioTrack?.stop();

  tracks.audioTrack = null;
};

export const stopScreenSharingTracks = () => {
  tracks.screenSharingTrack?.stop();

  tracks.screenSharingTrack = null;
};

export const stopAllTracks = () => {
  stopAudioTracks();
  stopVideoTracks();
  stopScreenSharingTracks();
};

export function* getUserAudio(constraints: IInCompleteConstraints) {
  let localMediaStream: MediaStream | null = null;
  try {
    localMediaStream = yield call(async () =>
      navigator.mediaDevices.getUserMedia({
        audio: constraints.audio?.isOpened && constraints.audio,
      }),
    );
  } catch (e) {
    yield put(CloseAudioStatus.action());
  }

  stopAudioTracks();

  if (localMediaStream) {
    yield call(assignAudioStreams, localMediaStream);
  }
}

export function* getUserVideo(constraints: IInCompleteConstraints) {
  let localMediaStream: MediaStream | null = null;
  try {
    localMediaStream = yield call(async () =>
      navigator.mediaDevices.getUserMedia({
        video: constraints.video?.isOpened && constraints.video,
      }),
    );
    stopVideoTracks();

    if (localMediaStream) {
      yield put(CloseVideoStatus.action());
      yield call(assignVideoStreams, localMediaStream);
    }
  } catch {
    yield put(CloseVideoStatus.action());
  }
}

export function* getUserDisplay() {
  let localDisplayStream: MediaStream | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localDisplayStream = yield call(async () => navigator.mediaDevices.getDisplayMedia());

    yield put(OpenScreenShareStatus.action());
  } catch {
    yield put(CloseScreenShareStatus.action());

    if (videoSender) {
      videoSender.replaceTrack(null);
    }
  }

  stopScreenSharingTracks();

  if (localDisplayStream) {
    yield call(assignScreenSharingTracks, localDisplayStream);
  }
}

export function* getAndSendUserMedia(): SagaIterator {
  const videoConstraints = yield select(getVideoConstraintsSelector);
  const audioConstraints = yield select(getAudioConstraintsSelector);

  const peerConnection = getPeerConnection();

  const constraints = { audio: audioConstraints, video: videoConstraints };

  let localMediaStream: MediaStream | null = null;
  try {
    localMediaStream = yield call(async () =>
      navigator.mediaDevices.getUserMedia({
        video: constraints.video.isOpened && constraints.video,
        audio: constraints.audio.isOpened && constraints.audio,
      }),
    );
  } catch {
    yield put(CloseVideoStatus.action());

    try {
      localMediaStream = yield call(async () =>
        navigator.mediaDevices.getUserMedia({
          audio: constraints.audio.isOpened && constraints.audio,
        }),
      );
    } catch (e) {
      yield put(CloseAudioStatus.action());
    }
  }
  stopAllTracks();

  if (localMediaStream) {
    yield call(assignStreams, localMediaStream);

    const callActive = yield select(doIhaveCallSelector);
    const outgoingCallActive = yield select(amICallingSelector);
    const acceptCallPending = yield select(getIsAcceptCallPendingSelector);

    if (!(callActive || outgoingCallActive || acceptCallPending)) {
      stopAllTracks();
    }

    if (tracks.videoTrack) {
      videoSender = peerConnection?.addTrack(tracks.videoTrack, localMediaStream) as RTCRtpSender;
    }
    if (tracks.audioTrack) {
      audioSender = peerConnection?.addTrack(tracks.audioTrack, localMediaStream) as RTCRtpSender;
    }
  }
}

export const getMediaDevicesList = async (kind: string) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === kind);
};
