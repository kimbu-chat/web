import moment from 'moment';
import {
  SystemMessageBase,
  Message,
  SystemMessageType,
  GroupChatMemberRemovedSystemMessageContent,
  GroupChatMemberAddedSystemMessageContent,
  GroupChatNameChangedSystemMessageContent,
} from 'store/messages/models';
import { UserStatus } from 'store/common/models';
import { TFunction } from 'i18next';
import { CallStatus } from 'store/calls/models';

export class MessageUtils {
  static getSystemMessageContent(text: string): SystemMessageBase {
    const systemMessage: SystemMessageBase = JSON.parse(text);
    return systemMessage;
  }

  static checkIfDatesAreSameDate = (startDate: Date, endDate: Date): boolean => !(startDate.toDateString() === endDate.toDateString());

  static constructSystemMessageText(message: Message, t: TFunction, myId: number): string {
    if (message.systemMessageType === SystemMessageType.GroupChatCreated) {
      return message?.userCreator?.id === myId
        ? t('systemMessage.you_created_group')
        : t('systemMessage.created_group', { name: `${message?.userCreator?.firstName} ${message?.userCreator?.lastName}` });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const groupChatMemberRemovedSystemMessageContent = <GroupChatMemberRemovedSystemMessageContent>systemMessageContent;
      return message.userCreator?.id === groupChatMemberRemovedSystemMessageContent.removedUserId
        ? t('systemMessage.left_group', { name: groupChatMemberRemovedSystemMessageContent.removedUserName })
        : t('systemMessage.left_group', { name: groupChatMemberRemovedSystemMessageContent.removedUserName });
    }
    if (message.systemMessageType === SystemMessageType.GroupChatMemberAdded) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const groupChatMemberRemovedSystemMessageContent = <GroupChatMemberAddedSystemMessageContent>systemMessageContent;
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
      const groupChatNameChangedSystemMessageContent = <GroupChatNameChangedSystemMessageContent>systemMessageContent;
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
      const callMessage = JSON.parse(message.text);
      if (callMessage.status === CallStatus.Successfull) {
        if (callMessage.userCallerId === myId) {
          return t('systemMessage.outgoing_call_success_ended', {
            duration: moment.utc(callMessage.seconds * 1000).format('HH:mm:ss'),
          });
        }
        return t('systemMessage.incoming_call_success_ended', {
          duration: moment.utc(callMessage.seconds * 1000).format('HH:mm:ss'),
        });
      }

      if (callMessage.status === CallStatus.Cancelled) {
        return callMessage.userCallerId === myId ? t('systemMessage.you_canceled_call') : t('systemMessage.someone_canceled_call');
      }

      if (callMessage.status === CallStatus.Declined) {
        return callMessage.userCallerId === myId ? t('systemMessage.you_declined_call') : t('systemMessage.someone_declined_call');
      }

      if (callMessage.status === CallStatus.NotAnswered) {
        return callMessage.userCallerId === myId ? t('systemMessage.someone_missed_call') : t('systemMessage.you_missed_call');
      }
    }

    return message.toString() || '';
  }

  static createSystemMessage(systemMessage: SystemMessageBase): string {
    return JSON.stringify(systemMessage);
  }

  static getUserStatus(status: UserStatus, lastOnlineTime: Date): string {
    if (status === UserStatus.Online) {
      return 'Online';
    }

    return moment.utc(lastOnlineTime).local().fromNow();
  }

  static signAndSeparate(arr: Message[]): Message[] {
    const separatedAndSignedMessages = arr.map((message, index) => {
      if (index <= arr.length - 1) {
        if (
          index === arr.length - 1 ||
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
          message = { ...message, needToShowDateSeparator: true, needToShowCreator: true };
          return message;
        }
      }

      if (
        index < arr.length - 1 &&
        (arr[index].userCreator?.id !== arr[index + 1].userCreator?.id || arr[index + 1].systemMessageType !== SystemMessageType.None)
      ) {
        message = { ...message, needToShowCreator: true };
      }

      return message;
    });

    return separatedAndSignedMessages;
  }
}
