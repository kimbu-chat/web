import { SystemMessageBase } from '../store/messages/models';

export class MessageHelpers {
  static createSystemMessage(systemMessage: SystemMessageBase): string {
    return JSON.stringify(systemMessage);
  }
}
