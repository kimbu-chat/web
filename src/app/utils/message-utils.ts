import moment from 'moment';
import { TFunction } from 'i18next';
import produce from 'immer';
import { CallStatus } from '../store/common/models';
import { IMessage, SystemMessageType } from '../store/chats/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISystemMessageBase {}

interface IGroupChatMemberRemovedSystemMessageContent extends ISystemMessageBase {
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

interface ICallMessage {
  userCallerId: number;
  userCalleeId: number;
  duration: number;
  status: CallStatus;
}

export class MessageUtils {
  static getSystemMessageContent(text: string): ISystemMessageBase {
    const systemMessage: ISystemMessageBase = JSON.parse(text);
    return systemMessage;
  }

  static checkIfDatesAreSameDate = (startDate: Date, endDate: Date): boolean => !(startDate.toDateString() === endDate.toDateString());

  static constructSystemMessageText(message: IMessage, t: TFunction, myId: number): string {
    if (message.systemMessageType === SystemMessageType.GroupChatCreated) {
      return message?.userCreator?.id === myId
        ? t('systemMessage.you_created_group')
        : t('systemMessage.created_group', { name: `${message?.userCreator?.firstName} ${message?.userCreator?.lastName}` });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const groupChatMemberRemovedSystemMessageContent = <IGroupChatMemberRemovedSystemMessageContent>systemMessageContent;
      return message.userCreator?.id === groupChatMemberRemovedSystemMessageContent.removedUserId
        ? t('systemMessage.left_group', { name: groupChatMemberRemovedSystemMessageContent.removedUserName })
        : t('systemMessage.left_group', { name: groupChatMemberRemovedSystemMessageContent.removedUserName });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatMemberAdded) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const groupChatMemberRemovedSystemMessageContent = <IGroupChatMemberAddedSystemMessageContent>systemMessageContent;
      if (message?.userCreator?.id === myId) {
        return t('systemMessage.you_added', {
          name: groupChatMemberRemovedSystemMessageContent.addedUserName,
        });
      }
      return t('systemMessage.someone_added', {
        someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
        addedName: groupChatMemberRemovedSystemMessageContent.addedUserName,
      });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatNameChanged) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const groupChatNameChangedSystemMessageContent = <IGroupChatNameChangedSystemMessageContent>systemMessageContent;
      if (message?.userCreator?.id === myId) {
        return t('systemMessage.you_changed_name', {
          oldName: groupChatNameChangedSystemMessageContent.oldName,
          newName: groupChatNameChangedSystemMessageContent.newName,
        });
      }
      return t('systemMessage.someone_changed_name', {
        oldName: groupChatNameChangedSystemMessageContent.oldName,
        newName: groupChatNameChangedSystemMessageContent.newName,
        someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
      });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatAvatarChanged) {
      if (message?.userCreator?.id === myId) {
        return t('systemMessage.you_changed_avatar');
      }
      return t('systemMessage.someone_changed_avatar', {
        someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
      });
    }

    if (message.systemMessageType === SystemMessageType.GroupChatAvatarRemoved) {
      if (message?.userCreator?.id === myId) {
        return t('systemMessage.you_removed_avatar');
      }
      return t('systemMessage.someone_removed_avatar', {
        someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
      });
    }

    if (message.systemMessageType === SystemMessageType.CallEnded) {
      const callMessage: ICallMessage = JSON.parse(message.text);

      if (callMessage.status === CallStatus.Ended) {
        if (callMessage.userCallerId === myId) {
          return t('systemMessage.outgoing_call_success_ended', {
            duration: moment.utc(callMessage.duration * 1000).format('HH:mm:ss'),
          });
        }
        return t('systemMessage.incoming_call_success_ended', {
          duration: moment.utc(callMessage.duration * 1000).format('HH:mm:ss'),
        });
      }

      if (callMessage.status === CallStatus.Cancelled) {
        return callMessage.userCallerId === myId ? t('systemMessage.you_canceled_call') : t('systemMessage.someone_canceled_call');
      }

      if (callMessage.status === CallStatus.Declined) {
        return callMessage.userCallerId === myId ? t('systemMessage.someone_declined_call') : t('systemMessage.you_declined_call');
      }

      if (callMessage.status === CallStatus.Interrupted) {
        return callMessage.userCallerId === myId ? t('systemMessage.outgoing_call_intrrerupted') : t('systemMessage.incoming_call_intrrerupted');
      }

      if (callMessage.status === CallStatus.NotAnswered) {
        return callMessage.userCallerId === myId
          ? t('systemMessage.someone_missed_call', { time: moment.utc(message.creationDateTime).local().format('LT').toLowerCase() })
          : t('systemMessage.you_missed_call', { time: moment.utc(message.creationDateTime).local().format('LT').toLowerCase() });
      }
    }

    return message.toString() || '';
  }

  static createSystemMessage(systemMessage: ISystemMessageBase): string {
    return JSON.stringify(systemMessage);
  }

  static signAndSeparate(arr: IMessage[]): IMessage[] {
    const signedMessages = arr.map((message, index) => {
      if (index < arr.length - 1) {
        if (
          MessageUtils.checkIfDatesAreSameDate(
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
          const generatedMessage = produce(message, (draft) => {
            draft.needToShowCreator = true;
            draft.needToShowDateSeparator = true;

            return draft;
          });

          return generatedMessage;
        }
      }

      if (
        index < arr.length - 1 &&
        (arr[index].userCreator?.id !== arr[index + 1].userCreator?.id || arr[index + 1].systemMessageType !== SystemMessageType.None)
      ) {
        const generatedMessage = produce(message, (draft) => {
          draft.needToShowCreator = true;

          return draft;
        });

        return generatedMessage;
      }

      return message;
    });

    signedMessages[signedMessages.length - 1] = produce(signedMessages[signedMessages.length - 1], (draft) => {
      if (draft) {
        draft.needToShowCreator = true;
        draft.needToShowDateSeparator = true;
      }
      return draft;
    });

    return signedMessages;
  }
}
