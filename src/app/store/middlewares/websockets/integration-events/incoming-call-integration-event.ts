import { UserPreview } from 'store/my-profile/models';

export interface IncomingCallIntegrationEvent {
	caller: UserPreview;
	isVideoEnabled: boolean;
	offer: RTCSessionDescriptionInit;
}
