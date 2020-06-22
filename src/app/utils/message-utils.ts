import {
  SystemMessageBase,
  Message,
  SystemMessageType,
  ConfereceMemberRemovedSystemMessageContent,
  ConfereceMemberAddedSystemMessageContent,
  ConfereceNameChangedSystemMessageContent
} from 'app/store/messages/types';
import { UserStatus } from 'app/store/contacts/types';
import moment from 'moment';

export class MessageUtils {
  static getSystemMessageContent(text: string): SystemMessageBase {
    const systemMessage: SystemMessageBase = JSON.parse(text);
    return systemMessage;
  }

  static constructSystemMessageText(message: Message, isCurrentUserMessageCreator: boolean = false): string {
    if (message.systemMessageType === SystemMessageType.ConferenceCreated) {
      return isCurrentUserMessageCreator
        ? 'Вы создали группу'
        : `${message?.userCreator?.firstName} ${message?.userCreator?.lastName} создал группу`;
    }
    if (message.systemMessageType === SystemMessageType.ConferenceMemberRemoved) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const confereceMemberRemovedSystemMessageContent = <ConfereceMemberRemovedSystemMessageContent>(
        systemMessageContent
      );
      return message.userCreator?.id === confereceMemberRemovedSystemMessageContent.removedUserId
        ? `${confereceMemberRemovedSystemMessageContent.removedUserName} покинул группу`
        : `${confereceMemberRemovedSystemMessageContent.removedUserName} покинул группу`; // change
    }
    if (message.systemMessageType === SystemMessageType.ConferenceMemberAdded) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const confereceMemberRemovedSystemMessageContent = <ConfereceMemberAddedSystemMessageContent>systemMessageContent;
      return isCurrentUserMessageCreator
        ? `Вы добавили ${confereceMemberRemovedSystemMessageContent.addedUserName}`
        : `${message.userCreator.firstName} ${message.userCreator.lastName} добавил ${confereceMemberRemovedSystemMessageContent.addedUserName}`;
    }
    if (message.systemMessageType === SystemMessageType.ConferenceNameChanged) {
      const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
      const confereceMemberRemovedSystemMessageContent = <ConfereceNameChangedSystemMessageContent>systemMessageContent;
      return isCurrentUserMessageCreator
        ? `Вы изменили название с ${confereceMemberRemovedSystemMessageContent.oldName} на ${confereceMemberRemovedSystemMessageContent.newName}`
        : `${message.userCreator.firstName} ${message.userCreator.lastName} изменил название с 
                ${confereceMemberRemovedSystemMessageContent.oldName} на ${confereceMemberRemovedSystemMessageContent.newName}`;
    }
    if (message.systemMessageType === SystemMessageType.ConferenceAvatarChanged) {
      return isCurrentUserMessageCreator
        ? `Вы изменили аватар`
        : `${message.userCreator.firstName} 
           ${message.userCreator.lastName} изменил аватар`;
    }

    throw 'Construct System MessageText function error';
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
}
