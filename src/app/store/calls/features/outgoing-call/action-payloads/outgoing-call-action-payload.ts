import { IUser } from 'app/store/common/models';

export interface IOutgoingCallActionPayload {
  calling: IUser;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
