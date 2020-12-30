import { IUserPreview } from 'app/store/my-profile/models';

export interface IncomingCallActionPayload {
  userInterlocutor: IUserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
