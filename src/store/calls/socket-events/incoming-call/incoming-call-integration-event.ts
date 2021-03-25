import { IUser } from '../../../common/models';

export interface IIncomingCallIntegrationEvent {
  userInterlocutor: IUser;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
