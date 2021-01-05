import { IUserPreview } from 'app/store/models';

export interface IOutgoingCallActionPayload {
  calling: IUserPreview;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
