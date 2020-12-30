import { createAction } from 'typesafe-actions';
import { ICreateChatActionPayload } from './create-chat-action-payload';

export class CreateChat {
  static get action() {
    return createAction('CREATE_DIALOG')<ICreateChatActionPayload>();
  }
}
