import { IUser } from 'kimbu-models';

export interface IIncomingCallIntegrationEvent {
  userInterlocutor: IUser;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
