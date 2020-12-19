import { setVideoSender, stopAllTracks } from '../../calls/utils/user-media';

export const peerConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export let peerConnection: RTCPeerConnection | null = null;

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(peerConfiguration);
};

export const resetPeerConnection = () => {
  stopAllTracks();
  peerConnection?.close();
  peerConnection = null;
  setVideoSender(null);
};
