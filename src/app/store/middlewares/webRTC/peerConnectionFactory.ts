export const peerConfiguration = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
interface IPeerConnection {
	connection?: RTCPeerConnection | null;
}
export const peerConnection: IPeerConnection = { connection: new RTCPeerConnection(peerConfiguration) };

const createOffer = async () => {
	const offer = await peerConnection.connection?.createOffer();
	await peerConnection.connection?.setLocalDescription(offer as RTCSessionDescriptionInit);
};
createOffer();
