import { IUserPreview } from 'app/store/models';

export interface IIncomingCallIntegrationEvent {
  userInterlocutor: IUserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
