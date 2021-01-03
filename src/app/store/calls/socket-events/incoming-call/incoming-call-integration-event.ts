import { IUserPreview } from 'store/my-profile/models';

export interface IIncomingCallIntegrationEvent {
  userInterlocutor: IUserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
