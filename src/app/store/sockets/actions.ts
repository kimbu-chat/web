import { createAction } from '../utils';
import { WebsocketsActionTypes } from './types';

export const initSocketConnectionAction = () => createAction(WebsocketsActionTypes.INIT_SOCKET_CONNECTION);

export type WebsocketActions = typeof initSocketConnectionAction;
