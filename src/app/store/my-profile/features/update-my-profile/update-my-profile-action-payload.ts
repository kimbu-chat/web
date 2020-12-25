import { Avatar } from '../../models';

export interface UpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  avatar?: Avatar;
}
