import { IUser } from '@store/common/models';
import { INormalizedMessage } from '../../../models';

export interface ICreateMessageActionPayload {
  message: INormalizedMessage;
  userCreator: IUser;
}
