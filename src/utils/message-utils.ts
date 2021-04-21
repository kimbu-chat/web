import moment from 'moment';
import { TFunction } from 'i18next';
import produce from 'immer';
import { CallStatus } from '../store/common/models';
import { IMessage, SystemMessageType } from '../store/chats/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISystemMessageBase {}

export interface IGroupChatMemberRemovedSystemMessageContent extends ISystemMessageBase {
  removedUserId: number;
  removedUserName: string;
}

interface IGroupChatNameChangedSystemMessageContent extends ISystemMessageBase {
  oldName: string;
  newName: string;
}

interface IGroupChatMemberAddedSystemMessageContent extends ISystemMessageBase {
  addedUserId: number;
  addedUserName: string;
  groupChatName: string;
  groupChatMembersNumber: number;
  groupChatAvatarUrl: string;
}

export interface ICallMessage {
  userCallerId: number;
  userCalleeId: number;
  duration: number;
  status: CallStatus;
}

export const getSystemMessageData = <TSystemMessagePayload>(
  message: IMessage,
): TSystemMessagePayload => JSON.parse(message.text);

export const checkIfDatesAreSameDate = (startDate: Date, endDate: Date): boolean =>
  startDate.toDateString() !== endDate.toDateString();

const getCallEndedMessage = (
  message: IMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) => {
  if (callMessage.userCallerId === myId) {
    return t('systemMessage.outgoing_call_success_ended', {
      duration: moment.utc(callMessage.duration * 1000).format('HH:mm:ss'),
    });
  }
  return t('systemMessage.incoming_call_success_ended', {
    duration: moment.utc(callMessage.duration * 1000).format('HH:mm:ss'),
  });
};

const getCallCanceledMessage = (
  message: IMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.you_canceled_call')
    : t('systemMessage.someone_canceled_call');

const getCallDeclinedMessage = (
  message: IMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.someone_declined_call')
    : t('systemMessage.you_declined_call');

const getCallIntrerruptedMessage = (
  message: IMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.outgoing_call_intrrerupted')
    : t('systemMessage.incoming_call_intrrerupted');

const getCallNotAnsweredMessage = (
  message: IMessage,
  callMessage: ICallMessage,
  t: TFunction,
  myId: number,
) =>
  callMessage.userCallerId === myId
    ? t('systemMessage.someone_missed_call', {
        time: moment.utc(message.creationDateTime).local().format('LT').toLowerCase(),
      })
    : t('systemMessage.you_missed_call', {
        time: moment.utc(message.creationDateTime).local().format('LT').toLowerCase(),
      });

const callMessageMap: {
  [key in Partial<CallStatus>]?: (
    message: IMessage,
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

const getGroupChatCreatedMessage = (message: IMessage, t: TFunction, myId: number) =>
  message?.userCreator?.id === myId
    ? t('systemMessage.you_created_group')
    : t('systemMessage.created_group', {
        name: `${message?.userCreator?.firstName} ${message?.userCreator?.lastName}`,
      });

const getGroupChatMemberRemovedMessage = (message: IMessage, t: TFunction) => {
  const systemMessageContent = getSystemMessageData<IGroupChatMemberRemovedSystemMessageContent>(
    message,
  );
  if (systemMessageContent.removedUserId === message.userCreator.id) {
    return t('systemMessage.left_group', {
      name: systemMessageContent.removedUserName,
    });
  }
  return t('systemMessage.removed_from_group', {
    name: systemMessageContent.removedUserName,
  });
};

const getGroupChatMemberAddedMessage = (message: IMessage, t: TFunction, myId: number) => {
  const systemMessageContent = getSystemMessageData<IGroupChatMemberAddedSystemMessageContent>(
    message,
  );

  if (message?.userCreator?.id === myId) {
    return t('systemMessage.you_added', {
      name: systemMessageContent.addedUserName,
    });
  }
  return t('systemMessage.someone_added', {
    someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
    addedName: systemMessageContent.addedUserName,
  });
};

const getGroupChatNameChangedMessage = (message: IMessage, t: TFunction, myId: number) => {
  const systemMessageContent = getSystemMessageData<IGroupChatNameChangedSystemMessageContent>(
    message,
  );

  if (message?.userCreator?.id === myId) {
    return t('systemMessage.you_changed_name', {
      oldName: systemMessageContent.oldName,
      newName: systemMessageContent.newName,
    });
  }
  return t('systemMessage.someone_changed_name', {
    oldName: systemMessageContent.oldName,
    newName: systemMessageContent.newName,
    someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
  });
};

const getGroupChatAvatarChangedMessage = (message: IMessage, t: TFunction, myId: number) => {
  if (message?.userCreator?.id === myId) {
    return t('systemMessage.you_changed_avatar');
  }
  return t('systemMessage.someone_changed_avatar', {
    someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
  });
};

const getGroupChatAvatarRemovedMessage = (message: IMessage, t: TFunction, myId: number) => {
  if (message?.userCreator?.id === myId) {
    return t('systemMessage.you_removed_avatar');
  }
  return t('systemMessage.someone_removed_avatar', {
    someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
  });
};

const getCallMessage = (message: IMessage, t: TFunction, myId: number) => {
  const callMessage = getSystemMessageData<ICallMessage>(message);
  const processingFunction = callMessageMap[callMessage.status];

  if (processingFunction) {
    return processingFunction(message, callMessage, t, myId);
  }

  return '';
};

const systemMessageMap: {
  [key in Partial<SystemMessageType>]?: (message: IMessage, t: TFunction, myId: number) => string;
} = {
  [SystemMessageType.GroupChatCreated]: getGroupChatCreatedMessage,
  [SystemMessageType.GroupChatMemberRemoved]: getGroupChatMemberRemovedMessage,
  [SystemMessageType.GroupChatMemberAdded]: getGroupChatMemberAddedMessage,
  [SystemMessageType.GroupChatNameChanged]: getGroupChatNameChangedMessage,
  [SystemMessageType.GroupChatAvatarChanged]: getGroupChatAvatarChangedMessage,
  [SystemMessageType.GroupChatAvatarRemoved]: getGroupChatAvatarRemovedMessage,
  [SystemMessageType.CallEnded]: getCallMessage,
};

export const constructSystemMessageText = (
  message: IMessage,
  t: TFunction,
  myId: number,
): string => {
  const processingFunction = systemMessageMap[message.systemMessageType];

  if (processingFunction) {
    return processingFunction(message, t, myId);
  }

  return message.toString() || '';
};

export const createSystemMessage = (systemMessage: ISystemMessageBase): string =>
  JSON.stringify(systemMessage);

export const signAndSeparate = (arr: IMessage[]): IMessage[] => {
  const signedMessages = arr.map((message, index) => {
    if (index < arr.length - 1) {
      if (
        checkIfDatesAreSameDate(
          moment
            .utc(arr[index + 1].creationDateTime || '')
            .local()
            .toDate(),
          moment
            .utc(message.creationDateTime || '')
            .local()
            .toDate(),
        )
      ) {
        return produce(message, (draft) => {
          draft.needToShowCreator = true;
          draft.needToShowDateSeparator = true;

          return draft;
        });
      }
    }

    if (
      index < arr.length - 1 &&
      (arr[index].userCreator?.id !== arr[index + 1].userCreator?.id ||
        arr[index + 1].systemMessageType !== SystemMessageType.None)
    ) {
      return produce(message, (draft) => {
        draft.needToShowCreator = true;

        return draft;
      });
    }

    return message;
  });

  signedMessages[signedMessages.length - 1] = produce(
    signedMessages[signedMessages.length - 1],
    (draft) => {
      if (draft) {
        draft.needToShowCreator = true;
        draft.needToShowDateSeparator = true;
      }
      return draft;
    },
  );

  return signedMessages;
};
