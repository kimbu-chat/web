import { TFunction } from 'i18next';
import {
  SystemMessageType,
  IMessage,
  CallStatus,
  IGroupChatMemberRemovedSystemMessage,
  IGroupChatMemberLeftSystemMessage,
  IGroupChatMemberAddedSystemMessage,
  IGroupChatNameChangedSystemMessage,
  ICallEndedSystemMessage,
} from 'kimbu-models';

import { INormalizedMessage } from '@store/chats/models';
import { IMessageCreatedIntegrationEvent } from '@store/chats/socket-events/message-created/message-created-integration-event';

import { SECOND_DURATION } from './constants';
import { getHourMinuteSecond, getShortTimeAmPm } from './date-utils';

import type { IUser } from 'kimbu-models';

export const getSystemMessageData = <TSystemMessagePayload>(
  message: INormalizedMessage | IMessage | IMessageCreatedIntegrationEvent,
): TSystemMessagePayload => (message.text ? JSON.parse(message.text) : {});

const getCallEndedMessage = (
  message: INormalizedMessage,
  callMessage: ICallEndedSystemMessage,
  t: TFunction,
  myId: number,
) => {
  if (callMessage.userCallerId === myId) {
    return t('systemMessage.outgoing_call_success_ended', {
      duration: getHourMinuteSecond(callMessage.duration || 0 * SECOND_DURATION),
    });
  }
  return t('systemMessage.incoming_call_success_ended', {
    duration: getHourMinuteSecond(callMessage.duration || 0 * SECOND_DURATION),
  });
};

const getCallCanceledMessage = (
  message: INormalizedMessage,
  callMessage: ICallEndedSystemMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.you_canceled_call')
    : t('systemMessage.someone_canceled_call');

const getCallDeclinedMessage = (
  message: INormalizedMessage,
  callMessage: ICallEndedSystemMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.someone_declined_call')
    : t('systemMessage.you_declined_call');

const getCallIntrerruptedMessage = (
  message: INormalizedMessage,
  callMessage: ICallEndedSystemMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.outgoing_call_interrupted')
    : t('systemMessage.incoming_call_interrupted');

const getCallNotAnsweredMessage = (
  message: INormalizedMessage,
  callMessage: ICallEndedSystemMessage,
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
    callMessage: ICallEndedSystemMessage,
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
  const systemMessageContent = getSystemMessageData<IGroupChatMemberRemovedSystemMessage>(message);
  return t('systemMessage.removed_from_group', {
    name: systemMessageContent.removedUserName,
  });
};

const getGroupChatMemberLeftMessage = (message: INormalizedMessage, t: TFunction) => {
  const systemMessageContent = getSystemMessageData<IGroupChatMemberLeftSystemMessage>(message);
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
  const systemMessageContent = getSystemMessageData<IGroupChatMemberAddedSystemMessage>(message);

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
  const systemMessageContent = getSystemMessageData<IGroupChatNameChangedSystemMessage>(message);

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
  const callMessage = getSystemMessageData<ICallEndedSystemMessage>(message);
  const processingFunction = callMessageMap[callMessage.status as CallStatus];

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
  [SystemMessageType.GroupChatMemberLeft]: getGroupChatMemberLeftMessage,
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
