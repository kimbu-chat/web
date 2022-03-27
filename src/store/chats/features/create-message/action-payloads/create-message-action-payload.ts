import { MessageLinkType } from 'kimbu-models';

import { INormalizedMessage } from '@store/chats/models';

export interface ICreateMessageActionPayload {
  linkedMessage?: INormalizedMessage;
  linkedMessageType?: MessageLinkType;
  text: string;
}
