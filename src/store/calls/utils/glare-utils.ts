import { REQUEST_TIMEOUT } from '@utils/constants';

let makingOffer = false;
let ignoreOffer = false;
let isSettingRemoteAnswerPending = false;

export function getMakingOffer() {
  return makingOffer;
}

export function getIgnoreOffer() {
  return ignoreOffer;
}

export function getIsSettingRemoteAnswerPending() {
  return isSettingRemoteAnswerPending;
}

export const setMakingOffer = (newValue: boolean) => {
  makingOffer = newValue;
};
export const setIgnoreOffer = (newValue: boolean) => {
  ignoreOffer = newValue;
};
export const setIsSettingRemoteAnswerPending = (newValue: boolean) => {
  isSettingRemoteAnswerPending = newValue;
};

// renegotiation

let isRenegotiationAccepted = true;

export function getIsRenegotiationAccepted() {
  return isRenegotiationAccepted;
}

export const setIsRenegotiationAccepted = (newValue: boolean) => {
  isRenegotiationAccepted = newValue;
};

export function waitForAllICE(pc: RTCPeerConnection | null) {
  const peerConnection = pc;
  return new Promise<void>((resolve, reject) => {
    if (peerConnection) {
      peerConnection.onicecandidate = (iceEvent) => {
        if (iceEvent.candidate === null) resolve();
      };
    }
    setTimeout(
      () => reject(new Error('Waited a long time for ice candidates...')),
      REQUEST_TIMEOUT,
    );
  });
}
