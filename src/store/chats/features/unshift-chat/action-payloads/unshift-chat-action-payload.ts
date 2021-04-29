import { IUser } from '@store/common/models';
import { IChat } from '../../../models';

export type IUnshiftChatActionPayload = { chat: IChat; users: IUser[] };
