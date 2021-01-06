import { setIsRenegotiationAccepted, setMakingOffer, setIgnoreOffer, setIsSettingRemoteAnswerPending } from 'app/store/calls/utils/glare-utils';
import { assignInterlocutorVideoTrack, assignInterlocutorAudioTrack, setVideoSender, stopAllTracks } from '../../calls/utils/user-media';

const peerConfiguration = {
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
  assignInterlocutorVideoTrack(null);
  assignInterlocutorAudioTrack(null);
  setIsRenegotiationAccepted(true);
  setMakingOffer(false);
  setIgnoreOffer(false);
  setIsSettingRemoteAnswerPending(false);
};
