import { IUserPreview } from 'app/store/my-profile/models';

export interface IIncomingCallActionPayload {
  userInterlocutor: IUserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
