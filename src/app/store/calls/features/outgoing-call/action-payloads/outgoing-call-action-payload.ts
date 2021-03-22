import { IUser } from '../../../../common/models';

export interface IOutgoingCallActionPayload {
  calling: IUser;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
