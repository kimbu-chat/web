import { IAvatar } from 'app/store/models';

export interface IGroupChat {
  id: number;
  avatar?: IAvatar | null;
  name: string;
  description?: string;
  membersCount: number;
  userCreatorId: number;
}
