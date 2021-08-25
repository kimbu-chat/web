import { CancelTokenSource } from 'axios';

const pendingMessagesMap = new Map<string, CancelTokenSource>();

export const cancelSendMessageRequest = (id: string): boolean => {
  const cancelToken = pendingMessagesMap.get(id);
  if (cancelToken) {
    cancelToken.cancel();

    pendingMessagesMap.delete(id);

    return true;
  }
  return false;
};

export const addMessageSendingRequest = (id: string, cancelToken: CancelTokenSource) => {
  pendingMessagesMap.set(id, cancelToken);
};

export const removeSendMessageRequest = (id: string) => {
  if (pendingMessagesMap.get(id)) {
    pendingMessagesMap.delete(id);
    return true;
  }
  return false;
};
