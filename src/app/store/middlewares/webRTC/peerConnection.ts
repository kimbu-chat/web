const configuration = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
export const peerConnection = new RTCPeerConnection(configuration);
