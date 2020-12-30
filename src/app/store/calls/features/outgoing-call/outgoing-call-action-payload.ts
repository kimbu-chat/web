import { IUserPreview } from 'store/my-profile/models';

export interface IOutgoingCallActionPayload {
  calling: IUserPreview;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
