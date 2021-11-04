import { TFunction } from 'i18next';
import { SystemMessageType, IMessage, CallStatus } from 'kimbu-models';

import { INormalizedMessage } from '@store/chats/models';
import { IMessageCreatedIntegrationEvent } from '@store/chats/socket-events/message-created/message-created-integration-event';

import { SECOND_DURATION } from './constants';
import { getHourMinuteSecond, getShortTimeAmPm } from './date-utils';

import type { IUser } from 'kimbu-models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISystemMessageBase {}

export interface IGroupChatMemberRemovedSystemMessageContent extends ISystemMessageBase {
  removedUserId: number;
  removedUserName: string;
}

export interface IGroupChatMemberLeftSystemMessageContent extends ISystemMessageBase {
  userName: string;
}

interface IGroupChatNameChangedSystemMessageContent extends ISystemMessageBase {
  oldName: string;
  newName: string;
}

interface IGroupChatMemberAddedSystemMessageContent extends ISystemMessageBase {
  addeduserId: number;
  addedUserName: string;
}

export interface ICallMessage {
  userCallerId: number;
  userCalleeId: number;
  duration: number;
  status: CallStatus;
}

export const getSystemMessageData = <TSystemMessagePayload>(
  message: INormalizedMessage | IMessage | IMessageCreatedIntegrationEvent,
): TSystemMessagePayload => (message.text ? JSON.parse(message.text) : {});

const getCallEndedMessage = (
  message: INormalizedMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) => {
  if (callMessage.userCallerId === myId) {
    return t('systemMessage.outgoing_call_success_ended', {
      duration: getHourMinuteSecond(callMessage.duration * SECOND_DURATION),
    });
  }
  return t('systemMessage.incoming_call_success_ended', {
    duration: getHourMinuteSecond(callMessage.duration * SECOND_DURATION),
  });
};

const getCallCanceledMessage = (
  message: INormalizedMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.you_canceled_call')
    : t('systemMessage.someone_canceled_call');

const getCallDeclinedMessage = (
  message: INormalizedMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.someone_declined_call')
    : t('systemMessage.you_declined_call');

const getCallIntrerruptedMessage = (
  message: INormalizedMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.outgoing_call_interrupted')
    : t('systemMessage.incoming_call_interrupted');

const getCallNotAnsweredMessage = (
  message: INormalizedMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.someone_missed_call', {
        time: getShortTimeAmPm(message.creationDateTime).toLowerCase(),
      })
    : t('systemMessage.you_missed_call', {
        time: getShortTimeAmPm(message.creationDateTime).toLowerCase(),
      });

const callMessageMap: {
  [key in Partial<CallStatus>]?: (
    message: INormalizedMessage,
    callMessage: ICallMessage,
    t: TFunction,
    myId: number,
  ) => string;
} = {
  [CallStatus.Ended]: getCallEndedMessage,
  [CallStatus.Cancelled]: getCallCanceledMessage,
  [CallStatus.Declined]: getCallDeclinedMessage,
  [CallStatus.Interrupted]: getCallIntrerruptedMessage,
  [CallStatus.NotAnswered]: getCallNotAnsweredMessage,
};

const getGroupChatCreatedMessage = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
) =>
  userCreator?.id === myId
    ? t('systemMessage.you_created_group')
    : t('systemMessage.created_group', {
        name: `${userCreator?.firstName} ${userCreator?.lastName}`,
      });

const getGroupChatMemberRemovedMessage = (message: INormalizedMessage, t: TFunction) => {
  const systemMessageContent =
    getSystemMessageData<IGroupChatMemberRemovedSystemMessageContent>(message);
  return t('systemMessage.removed_from_group', {
    name: systemMessageContent.removedUserName,
  });
};

const getGroupChatMemberLeftMessage = (message: INormalizedMessage, t: TFunction) => {
  const systemMessageContent =
    getSystemMessageData<IGroupChatMemberLeftSystemMessageContent>(message);
  return t('systemMessage.left_group', {
    name: systemMessageContent.userName,
  });
};

const getGroupChatMemberAddedMessage = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
) => {
  const systemMessageContent =
    getSystemMessageData<IGroupChatMemberAddedSystemMessageContent>(message);

  if (userCreator?.id === myId) {
    return t('systemMessage.you_added', {
      name: systemMessageContent.addedUserName,
    });
  }
  return t('systemMessage.someone_added', {
    someonesName: `${userCreator?.firstName} ${userCreator?.lastName}`,
    addedName: systemMessageContent.addedUserName,
  });
};

const getGroupChatNameChangedMessage = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
) => {
  const systemMessageContent =
    getSystemMessageData<IGroupChatNameChangedSystemMessageContent>(message);

  if (userCreator?.id === myId) {
    return t('systemMessage.you_changed_name', {
      oldName: systemMessageContent.oldName,
      newName: systemMessageContent.newName,
    });
  }
  return t('systemMessage.someone_changed_name', {
    oldName: systemMessageContent.oldName,
    newName: systemMessageContent.newName,
    someonesName: `${userCreator?.firstName} ${userCreator?.lastName}`,
  });
};

const getGroupChatAvatarChangedMessage = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
) => {
  if (userCreator?.id === myId) {
    return t('systemMessage.you_changed_avatar');
  }
  return t('systemMessage.someone_changed_avatar', {
    someonesName: `${userCreator?.firstName} ${userCreator?.lastName}`,
  });
};

const getGroupChatAvatarRemovedMessage = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
) => {
  if (userCreator?.id === myId) {
    return t('systemMessage.you_removed_avatar');
  }
  return t('systemMessage.someone_removed_avatar', {
    someonesName: `${userCreator?.firstName} ${userCreator?.lastName}`,
  });
};

const getCallMessage = (message: INormalizedMessage, t: TFunction, myId: number) => {
  const callMessage = getSystemMessageData<ICallMessage>(message);
  const processingFunction = callMessageMap[callMessage.status];

  if (processingFunction) {
    return processingFunction(message, callMessage, t, myId);
  }

  return '';
};

const systemMessageMap: {
  [key in Partial<SystemMessageType>]?: (
    message: INormalizedMessage,
    t: TFunction,
    myId: number,
    userCreator?: IUser,
  ) => string;
} = {
  [SystemMessageType.GroupChatCreated]: getGroupChatCreatedMessage,
  [SystemMessageType.GroupChatMemberRemoved]: getGroupChatMemberRemovedMessage,
  // todo: update types
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  GroupChatMemberLeft: getGroupChatMemberLeftMessage,
  [SystemMessageType.GroupChatMemberAdded]: getGroupChatMemberAddedMessage,
  [SystemMessageType.GroupChatNameChanged]: getGroupChatNameChangedMessage,
  [SystemMessageType.GroupChatAvatarChanged]: getGroupChatAvatarChangedMessage,
  [SystemMessageType.GroupChatAvatarRemoved]: getGroupChatAvatarRemovedMessage,
  [SystemMessageType.CallEnded]: getCallMessage,
};

export const constructSystemMessageText = (
  message: INormalizedMessage,
  t: TFunction,
  myId: number,
  userCreator?: IUser,
): string => {
  const processingFunction = systemMessageMap[message.systemMessageType];

  if (processingFunction) {
    return processingFunction(message, t, myId, userCreator);
  }

  return message.toString() || '';
};

export const createSystemMessage = (systemMessage: ISystemMessageBase): string =>
  JSON.stringify(systemMessage);
