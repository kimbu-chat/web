import { CancelTokenSource } from 'axios';

const pendingMessagesMap = new Map<number, CancelTokenSource>();

export const cancelSendMessageRequest = (id: number): boolean => {
  const cancelToken = pendingMessagesMap.get(id);
  if (cancelToken) {
    cancelToken.cancel();

    pendingMessagesMap.delete(id);

    return true;
  }
  return false;
};

export const addMessageSendingRequest = (id: number, cancelToken: CancelTokenSource) => {
  pendingMessagesMap.set(id, cancelToken);
};

export const removeSendMessageRequest = (id: number) => {
  if (pendingMessagesMap.get(id)) {
    pendingMessagesMap.delete(id);
    return true;
  }
  return false;
};
