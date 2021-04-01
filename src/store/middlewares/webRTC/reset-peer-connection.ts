import {
  assignInterlocutorVideoTrack,
  assignInterlocutorAudioTrack,
  setVideoSender,
  stopAllTracks,
} from '@store/calls/utils/user-media';
import {
  setIsRenegotiationAccepted,
  setMakingOffer,
  setIgnoreOffer,
  setIsSettingRemoteAnswerPending,
} from '@store/calls/utils/glare-utils';
import {
  getPeerConnection,
  setPeerConnection,
  setInterlocutorOffer,
} from './peerConnectionFactory';

export const resetPeerConnection = () => {
  const peerConnection = getPeerConnection();

  stopAllTracks();
  peerConnection?.close();
  setPeerConnection(null);
  setVideoSender(null);
  setInterlocutorOffer(null);
  assignInterlocutorVideoTrack(null);
  assignInterlocutorAudioTrack(null);
  setIsRenegotiationAccepted(true);
  setMakingOffer(false);
  setIgnoreOffer(false);
  setIsSettingRemoteAnswerPending(false);
};
