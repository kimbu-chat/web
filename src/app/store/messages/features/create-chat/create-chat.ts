import { createAction } from 'typesafe-actions';
import { CreateChatActionPayload } from './create-chat-action-payload';

export class CreateChat {
  static get action() {
    return createAction('CREATE_DIALOG')<CreateChatActionPayload>();
  }
}
