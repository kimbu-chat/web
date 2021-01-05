import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { getAudioConstraintsSelector, getVideoConstraintsSelector } from 'app/store/calls/selectors';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { CloseScreenShareStatus } from '../features/change-screen-share-status/close-screen-share-status';
import { CloseAudioStatus } from '../features/change-user-media-status/close-audio-status';
import { CloseVideoStatus } from '../features/change-user-media-status/close-video-status';
import { OpenAudioStatus } from '../features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from '../features/change-user-media-status/open-video-status';
import { OpenScreenShareStatus } from '../features/change-screen-share-status/open-screen-share-status';

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
export let interlocutorVideoTrack: MediaStreamTrack | null;
export let interlocutorAudioTrack: MediaStreamTrack | null;
export let videoSender: RTCRtpSender | null;
export let audioSender: RTCRtpSender | null;

export const assignInterlocutorVideoTrack = (track: MediaStreamTrack | null) => {
  interlocutorVideoTrack = track;
};

export const assignInterlocutorAudioTrack = (track: MediaStreamTrack | null) => {
  interlocutorAudioTrack = track;
};

export const setVideoSender = (sender: RTCRtpSender | null) => {
  videoSender = sender;
};

const assignAudioStreams = (stream: MediaStream) => {
  [tracks.audioTrack] = stream.getAudioTracks();
};

const assignVideoStreams = (stream: MediaStream) => {
  [tracks.videoTrack] = stream.getVideoTracks();
};

const assignScreenSharingTracks = (stream: MediaStream) => {
  [tracks.screenSharingTrack] = stream.getTracks();
};

const assignStreams = (stream: MediaStream) => {
  [tracks.videoTrack] = stream.getVideoTracks();
  [tracks.audioTrack] = stream.getAudioTracks();
};

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

export const getUserAudio = function* (constraints: IInCompleteConstraints) {
  let localMediaStream: MediaStream | null = null;
  try {
    console.log(constraints.audio?.isOpened && constraints.audio);

    localMediaStream = yield call(
      async () =>
        await navigator.mediaDevices.getUserMedia({
          audio: constraints.audio?.isOpened && constraints.audio,
        }),
    );

    yield put(OpenAudioStatus.action());
  } catch (e) {
    console.log(e);
    yield put(CloseAudioStatus.action());
  }

  yield call(stopAudioTracks);

  if (localMediaStream) {
    assignAudioStreams(localMediaStream);
  }
};

export const getUserVideo = function* (constraints: IInCompleteConstraints) {
  let localMediaStream: MediaStream | null = null;
  try {
    localMediaStream = yield call(
      async () =>
        await navigator.mediaDevices.getUserMedia({
          video: constraints.video?.isOpened && constraints.video,
        }),
    );

    yield put(OpenVideoStatus.action());
  } catch {
    yield put(CloseVideoStatus.action());
  }

  stopVideoTracks();

  if (localMediaStream) {
    assignVideoStreams(localMediaStream);
  }
};

export const getUserDisplay = function* () {
  let localDisplayStream: MediaStream | null = null;
  try {
    localDisplayStream = yield call(async () => await (navigator.mediaDevices as any).getDisplayMedia());

    yield put(OpenScreenShareStatus.action());
  } catch {
    yield put(CloseScreenShareStatus.action());

    if (videoSender) {
      videoSender.replaceTrack(null);
    }
  }

  stopScreenSharingTracks();

  if (localDisplayStream) {
    assignScreenSharingTracks(localDisplayStream);
  }
};

export function* getAndSendUserMedia(): SagaIterator {
  const videoConstraints = yield select(getVideoConstraintsSelector);
  const audioConstraints = yield select(getAudioConstraintsSelector);

  const constraints = { audio: audioConstraints, video: videoConstraints };

  let localMediaStream: MediaStream | null = null;
  try {
    localMediaStream = yield call(
      async () =>
        await navigator.mediaDevices.getUserMedia({
          video: constraints.video.isOpened && constraints.video,
          audio: constraints.audio.isOpened && constraints.audio,
        }),
    );
  } catch {
    yield put(CloseVideoStatus.action());

    try {
      localMediaStream = yield call(
        async () =>
          await navigator.mediaDevices.getUserMedia({
            audio: constraints.audio.isOpened && constraints.audio,
          }),
      );
    } catch (e) {
      yield put(CloseAudioStatus.action());
    }
  }
  yield call(stopAllTracks);

  if (localMediaStream) {
    assignStreams(localMediaStream);

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
  console.log(devices);
  const deviceList = devices.filter((device) => device.kind === kind);
  return deviceList;
};
