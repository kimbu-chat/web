import moment from 'moment';
import {
	SystemMessageBase,
	Message,
	SystemMessageType,
	ConfereceMemberRemovedSystemMessageContent,
	ConfereceMemberAddedSystemMessageContent,
	ConfereceNameChangedSystemMessageContent,
} from 'app/store/messages/models';
import { UserStatus } from 'app/store/friends/models';
import { TFunction } from 'i18next';

export class MessageUtils {
	static getSystemMessageContent(text: string): SystemMessageBase {
		const systemMessage: SystemMessageBase = JSON.parse(text);
		return systemMessage;
	}

	static constructSystemMessageText(
		message: Message,
		isCurrentUserMessageCreator: boolean = false,
		t: TFunction,
	): string {
		if (message.systemMessageType === SystemMessageType.ConferenceCreated) {
			return isCurrentUserMessageCreator
				? t('systemMessage.you_created_group')
				: t('systemMessage.created_group', {
						name: `${message?.userCreator?.firstName} ${message?.userCreator?.lastName}`,
				  });
		}
		if (message.systemMessageType === SystemMessageType.ConferenceMemberRemoved) {
			const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
			const confereceMemberRemovedSystemMessageContent = <ConfereceMemberRemovedSystemMessageContent>(
				systemMessageContent
			);
			return message.userCreator?.id === confereceMemberRemovedSystemMessageContent.removedUserId
				? t('systemMessage.left_group', {
						name: confereceMemberRemovedSystemMessageContent.removedUserName,
				  })
				: t('systemMessage.left_group', {
						name: confereceMemberRemovedSystemMessageContent.removedUserName,
				  }); // change
		}
		if (message.systemMessageType === SystemMessageType.ConferenceMemberAdded) {
			const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
			const confereceMemberRemovedSystemMessageContent = <ConfereceMemberAddedSystemMessageContent>(
				systemMessageContent
			);
			return isCurrentUserMessageCreator
				? t('systemMessage.you_added', {
						name: confereceMemberRemovedSystemMessageContent.addedUserName,
				  })
				: t('systemMessage.someone_added', {
						someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
						addedName: confereceMemberRemovedSystemMessageContent.addedUserName,
				  });
		}
		if (message.systemMessageType === SystemMessageType.ConferenceNameChanged) {
			const systemMessageContent = MessageUtils.getSystemMessageContent(message.text);
			const confereceMemberRemovedSystemMessageContent = <ConfereceNameChangedSystemMessageContent>(
				systemMessageContent
			);
			return isCurrentUserMessageCreator
				? t('systemMessage.you_changed_name', {
						oldName: confereceMemberRemovedSystemMessageContent.oldName,
						newName: confereceMemberRemovedSystemMessageContent.newName,
				  })
				: t('systemMessage.someone_changed_name', {
						oldName: confereceMemberRemovedSystemMessageContent.oldName,
						newName: confereceMemberRemovedSystemMessageContent.newName,
						someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
				  });
		}
		if (message.systemMessageType === SystemMessageType.ConferenceAvatarChanged) {
			return isCurrentUserMessageCreator
				? t('systemMessage.you_changed_avatar')
				: t('systemMessage.someone_changed_avatar', {
						someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
				  });
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
