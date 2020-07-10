import { SystemMessageBase } from '../store/messages/interfaces';

export class Helpers {
  static createSystemMessage(systemMessage: SystemMessageBase): string {
    return JSON.stringify(systemMessage);
  }
}
