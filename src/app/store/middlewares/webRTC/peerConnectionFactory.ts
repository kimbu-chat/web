import { setVideoSender, stopAllTracks } from '../../calls/utils/user-media';

export const peerConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export let peerConnection: RTCPeerConnection | null = null;

export let interlocutorOffer: RTCSessionDescriptionInit | null = null;

export const setInterlocutorOffer = (offer: RTCSessionDescriptionInit | null) => {
  interlocutorOffer = offer;
};

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(peerConfiguration);
};

export const resetPeerConnection = () => {
  stopAllTracks();
  peerConnection?.close();
  peerConnection = null;
  setVideoSender(null);
  setInterlocutorOffer(null);
};

setInterval(() => console.log(peerConnection?.connectionState), 1000);
