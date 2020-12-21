import { UserPreview } from 'app/store/my-profile/models';

export interface IncomingCallActionPayload {
  userInterlocutor: UserPreview;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
