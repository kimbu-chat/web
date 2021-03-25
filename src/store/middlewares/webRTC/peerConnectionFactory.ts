const peerConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

let peerConnection: RTCPeerConnection | null = null;

let interlocutorOffer: RTCSessionDescriptionInit | null = null;

export const setInterlocutorOffer = (offer: RTCSessionDescriptionInit | null) => {
  interlocutorOffer = offer;
};

export const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(peerConfiguration);
};

export const setPeerConnection = (connection: RTCPeerConnection | null) => {
  peerConnection = connection;
};

export const getPeerConnection = (): RTCPeerConnection | null => peerConnection;
export const getInterlocutorOffer = (): RTCSessionDescriptionInit | null => interlocutorOffer;
