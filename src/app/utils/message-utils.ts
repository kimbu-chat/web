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
import { CallStatus } from 'app/store/calls/models';

export class MessageUtils {
	static getSystemMessageContent(text: string): SystemMessageBase {
		const systemMessage: SystemMessageBase = JSON.parse(text);
		return systemMessage;
	}

	static dateDifference = (startDate: Date, endDate: Date): boolean => {
		return !(startDate.toDateString() === endDate.toDateString());
	};

	static constructSystemMessageText(message: Message, t: TFunction, myId: number): string {
		if (message.systemMessageType === SystemMessageType.ConferenceCreated) {
			return message?.userCreator?.id === myId
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
			return message?.userCreator?.id === myId
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
			return message?.userCreator?.id === myId
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
			return message?.userCreator?.id === myId
				? t('systemMessage.you_changed_avatar')
				: t('systemMessage.someone_changed_avatar', {
						someonesName: `${message.userCreator?.firstName} ${message.userCreator?.lastName}`,
				  });
		}

		if (message.systemMessageType === SystemMessageType.MissedCall) {
			try {
				const callMessage = JSON.parse(message.text);
				if (callMessage.status === CallStatus.Successfull) {
					return callMessage.userCallerId === myId
						? t('systemMessage.outgoing_call_success_ended', {
								duration: moment.utc(callMessage.seconds * 1000).format('HH:mm:ss'),
						  })
						: t('systemMessage.incoming_call_success_ended', {
								duration: moment.utc(callMessage.seconds * 1000).format('HH:mm:ss'),
						  });
				}

				if (callMessage.status === CallStatus.Cancelled) {
					return callMessage.userCallerId === myId
						? t('systemMessage.you_canceled_call')
						: t('systemMessage.someone_canceled_call');
				}

				if (callMessage.status === CallStatus.Declined) {
					return callMessage.userCallerId === myId
						? t('systemMessage.you_declined_call')
						: t('systemMessage.someone_declined_call');
				}

				if (callMessage.status === CallStatus.NotAnswered) {
					return callMessage.userCallerId === myId
						? t('systemMessage.someone_missed_call')
						: t('systemMessage.you_missed_call');
				}
			} catch {}
		}

		return message.toString() || '';
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

	static signAndSeparate(arr: Message[]): Message[] {
		const separatedAndSignedMessages = arr.map((message, index) => {
			if (index <= arr.length - 1) {
				if (
					index === arr.length - 1 ||
					MessageUtils.dateDifference(
						new Date(arr[index + 1].creationDateTime || ''),
						new Date(message.creationDateTime || ''),
					)
				) {
					message = { ...message, needToShowDateSeparator: true, needToShowCreator: true };
					return message;
				}
			}

			if (
				index < arr.length - 1 &&
				(arr[index].userCreator?.id !== arr[index + 1].userCreator?.id ||
					arr[index + 1].systemMessageType !== SystemMessageType.None)
			) {
				message = { ...message, needToShowCreator: true };
			}

			return message;
		});

		return separatedAndSignedMessages;
	}
}
