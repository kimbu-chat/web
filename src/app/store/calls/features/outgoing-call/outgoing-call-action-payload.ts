import { UserPreview } from 'store/my-profile/models';

export interface OutgoingCallActionPayload {
  calling: UserPreview;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
