import { IUserPreview } from 'store/my-profile/models';

export interface IncomingCallIntegrationEvent {
  userInterlocutor: IUserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
