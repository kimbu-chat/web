import { createEmptyAction } from "../common/actions";

export namespace InitActions {
  export const initSocketConnection = createEmptyAction('INIT_SOCKET_CONNECTION');
  export const init = createEmptyAction('INIT');
}
