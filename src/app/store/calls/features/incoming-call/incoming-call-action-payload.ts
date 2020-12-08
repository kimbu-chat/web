import { UserPreview } from 'app/store/my-profile/models';

export interface IncomingCallActionPayload {
  caller: UserPreview;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
