import { IUser } from 'app/store/common/models';

export interface IIncomingCallIntegrationEvent {
  userInterlocutor: IUser;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
