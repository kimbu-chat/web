import { Avatar } from '../../models';

export interface UpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  avatar?: Avatar;
}
