import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { getVideoConstraints, getAudioConstraints } from 'app/store/calls/selectors';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { CloseAudioStatus } from '../features/close-audio-status/close-audio-status';
import { CloseVideoStatus } from '../features/close-video-status/close-video-status';
import { IInCompleteConstraints } from '../models';

export const tracks: {
  [thingName: string]: MediaStreamTrack[];
} = { videoTracks: [], audioTracks: [], screenSharingTracks: [] };

export let interlocurorVideoTrack: MediaStreamTrack;
export let interlocurorAudioTrack: MediaStreamTrack;

export const assignInterlocurorVideoTrack = (track: MediaStreamTrack) => {
  interlocurorVideoTrack = track;
};

export const assignInterlocurorAudioTrack = (track: MediaStreamTrack) => {
  interlocurorAudioTrack = track;
};

export let videoSender: RTCRtpSender | null;
export let audioSender: RTCRtpSender | null;

export const setVideoSender = (sender: RTCRtpSender | null) => {
  videoSender = sender;
};

export const setAudioSender = (sender: RTCRtpSender | null) => {
  audioSender = sender;
};

export const assignAudioStreams = (stream: MediaStream) => {
  tracks.audioTracks.push(...stream.getAudioTracks());
};

export const assignVideoStreams = (stream: MediaStream) => {
  tracks.videoTracks.push(...stream.getVideoTracks());
};

export const assignScreenSharingTracks = (stream: MediaStream) => {
  tracks.screenSharingTracks.push(...stream.getTracks());
};

export const assignStreams = (stream: MediaStream) => {
  tracks.videoTracks.push(...stream.getVideoTracks());
  tracks.audioTracks.push(...stream.getAudioTracks());
};

export const stopAudioTracks = () => {
  tracks.audioTracks.forEach((track) => {
    track.stop();
  });
  tracks.audioTracks = [];
};

export const stopVideoTracks = () => {
  tracks.videoTracks.forEach((track) => {
    track.stop();
  });
  tracks.videoTracks = [];
};

export const stopScreenSharingTracks = () => {
  tracks.screenSharingTracks.forEach((track) => {
    track.stop();
  });
  tracks.screenSharingTracks = [];
};

export const stopAllTracks = () => {
  stopAudioTracks();
  stopVideoTracks();
  stopScreenSharingTracks();
};

export const getUserAudio = async (constraints: IInCompleteConstraints) => {
  let localMediaStream: MediaStream;
  try {
    localMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: constraints.audio?.isOpened && constraints.audio,
    });
  } catch (e) {
    throw new Error('NO_AUDIO');
  }

  stopAudioTracks();

  if (localMediaStream) {
    assignAudioStreams(localMediaStream);
  }
};

export const getUserVideo = async (constraints: IInCompleteConstraints) => {
  let localMediaStream: MediaStream;
  try {
    localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: constraints.video?.isOpened && constraints.video,
    });
  } catch {
    throw new Error('NO_VIDEO');
  }

  stopVideoTracks();

  if (localMediaStream) {
    assignVideoStreams(localMediaStream);
  }
};

export const getUserDisplay = async () => {
  let localDisplayStream: MediaStream;
  try {
    localDisplayStream = await (navigator.mediaDevices as any).getDisplayMedia();
  } catch {
    throw new Error('NO_DISPLAY');
  }

  stopScreenSharingTracks();

  if (localDisplayStream) {
    assignScreenSharingTracks(localDisplayStream);
  }
};

export function* getAndSendUserMedia(): SagaIterator {
  const videoConstraints = yield select(getVideoConstraints);
  const audioConstraints = yield select(getAudioConstraints);

  const constraints = { audio: audioConstraints, video: videoConstraints };

  let localMediaStream: MediaStream;
  try {
    localMediaStream = yield call(
      async () =>
        await navigator.mediaDevices.getUserMedia({
          video: constraints.video.isOpened && constraints.video,
          audio: constraints.audio.isOpened && constraints.audio,
        }),
    );
  } catch {
    try {
      localMediaStream = yield call(
        async () =>
          await navigator.mediaDevices.getUserMedia({
            audio: constraints.audio.isOpened && constraints.audio,
          }),
      );
      yield put(CloseVideoStatus.action());
    } catch (e) {
      yield put(CloseAudioStatus.action());
    }
  }
  stopAllTracks();

  // @ts-ignore
  if (localMediaStream) {
    assignStreams(localMediaStream);

    if (tracks.videoTracks.length > 0) {
      videoSender = peerConnection?.addTrack(tracks.videoTracks[0], localMediaStream) as RTCRtpSender;
    }
    if (tracks.audioTracks.length > 0) {
      audioSender = peerConnection?.addTrack(tracks.audioTracks[0], localMediaStream) as RTCRtpSender;
    }
  }
}

export const getMediaDevicesList = async (kind: string) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const deviceList = devices.filter((device) => device.kind === kind);
  return deviceList;
};
