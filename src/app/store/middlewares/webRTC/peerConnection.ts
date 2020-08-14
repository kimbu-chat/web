export const peerConfiguration = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
export const peerConnection = { connection: new RTCPeerConnection(peerConfiguration) };

const createOffer = async () => {
	const offer = await peerConnection.connection.createOffer();
	await peerConnection.connection.setLocalDescription(offer);
};
createOffer();
