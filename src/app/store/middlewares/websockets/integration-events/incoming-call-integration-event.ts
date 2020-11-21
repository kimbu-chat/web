import { UserPreview } from 'app/store/my-profile/models';

export interface IncomingCallIntegrationEvent {
	caller: UserPreview;
	isVideoEnabled: boolean;
	offer: RTCSessionDescriptionInit;
}
