import { UserPreview } from 'store/my-profile/models';

export interface IncomingCallIntegrationEvent {
  userInterlocutor: UserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
