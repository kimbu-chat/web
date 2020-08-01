import { Dialog } from './models';
import produce from 'immer';
import { DialogService } from './dialog-service';
import { CreateMessageResponse } from '../messages/models';
import { InterlocutorType } from './models';
import { createReducer } from 'typesafe-actions';
import { ChatActions } from './actions';
import { MessageActions } from '../messages/actions';
import { FriendActions } from '../friends/actions';

export interface DialogsState {
	loading: boolean;
	hasMore: boolean;
	dialogs: Dialog[];
	selectedDialogId?: number | null;
}

const initialState: DialogsState = {
	loading: false,
	hasMore: true,
	dialogs: [],
	selectedDialogId: null,
};

const checkDialogExists = (dialogId: number, state: DialogsState): boolean =>
	Boolean(state.dialogs.find(({ id }) => id === dialogId));

const getDialogArrayIndex = (dialogId: number, state: DialogsState): number =>
	state.dialogs.findIndex(({ id }) => id === dialogId);

const dialogs = createReducer<DialogsState>(initialState)
	.handleAction(
		ChatActions.interlocutorStoppedTyping,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.interlocutorStoppedTyping>) => {
			const { isConference, interlocutorId, objectId } = payload;

			const dialogId: number = DialogService.getDialogIdentifier(
				!isConference ? objectId : null,
				isConference ? interlocutorId : null,
			);

			const isDialogExists: boolean = checkDialogExists(dialogId, draft);

			if (!isDialogExists) {
				return draft;
			}

			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

			(draft.dialogs[dialogIndex].timeoutId = null), (draft.dialogs[dialogIndex].isInterlocutorTyping = false);

			return draft;
		}),
	)
	.handleAction(
		ChatActions.interlocutorMessageTyping,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.interlocutorMessageTyping>) => {
			const { isConference, interlocutorId, objectId } = payload;

			const dialogId: number = DialogService.getDialogIdentifier(
				!isConference ? objectId : null,
				isConference ? interlocutorId : null,
			);

			const isDialogExists: boolean = checkDialogExists(dialogId, draft);

			if (!isDialogExists) {
				return draft;
			}

			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

			clearTimeout(draft.dialogs[dialogIndex].timeoutId);

			(draft.dialogs[dialogIndex].draftMessage = payload.text),
				(draft.dialogs[dialogIndex].timeoutId = payload.timeoutId),
				(draft.dialogs[dialogIndex].isInterlocutorTyping = true);

			return draft;
		}),
	)
	.handleAction(
		MessageActions.createMessageSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
			const { dialogId, newMessageId }: CreateMessageResponse = payload;

			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

			draft.dialogs[dialogIndex].lastMessage.id = newMessageId;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.createConferenceSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.createConferenceSuccess>) => {
			const newDialog = payload;

			const isDialogExists: boolean = checkDialogExists(newDialog.id, draft);

			if (!isDialogExists) {
				draft.dialogs.unshift(newDialog);
				return draft;
			}

			return draft;
		}),
	)
	.handleAction(
		ChatActions.addUsersToConferenceSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.addUsersToConferenceSuccess>) => {
			const { id } = payload;

			const dialogIndex: number = getDialogArrayIndex(id, draft);

			const conference = draft.dialogs[dialogIndex].conference || { membersCount: 0 };

			conference.membersCount = (conference.membersCount || 0) + 1;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.muteChatSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.muteChatSuccess>) => {
			const { id } = payload;

			const dialogIndex: number = getDialogArrayIndex(id, draft);

			draft.dialogs[dialogIndex].isMuted = !draft.dialogs[dialogIndex].isMuted;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.renameConferenceSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.renameConferenceSuccess>) => {
			const { dialog, newName } = payload;
			const { id } = dialog;

			const dialogIndex: number = getDialogArrayIndex(id, draft);

			const conference = draft.dialogs[dialogIndex].conference || { name: '' };

			conference.name = newName;
			return draft;
		}),
	)
	.handleAction(
		ChatActions.changeSelectedChat,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.changeSelectedChat>) => {
			return {
				...draft,
				selectedDialogId: payload,
			};
		}),
	)
	.handleAction(
		ChatActions.unsetSelectedChat,
		produce((draft: DialogsState) => {
			return {
				...draft,
				selectedDialogId: null,
			};
		}),
	)
	.handleAction(
		ChatActions.getChats,
		produce((draft: DialogsState) => {
			return {
				...draft,
				loading: true,
			};
		}),
	)
	.handleAction(
		ChatActions.getChatsSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.getChatsSuccess>) => {
			const { dialogs, hasMore, initializedBySearch } = payload;

			(draft.loading = false), (draft.hasMore = hasMore);

			if (initializedBySearch) {
				draft.dialogs = dialogs;
			} else {
				draft.dialogs = draft.dialogs.concat(dialogs);
			}

			return draft;
		}),
	)
	.handleAction(
		ChatActions.getChatsFailure,
		produce((draft: DialogsState) => {
			return {
				...draft,
				loading: false,
			};
		}),
	)
	.handleAction(
		[ChatActions.leaveConferenceSuccess, ChatActions.removeChatSuccess],
		produce(
			(
				draft: DialogsState,
				{
					payload,
				}:
					| ReturnType<typeof ChatActions.leaveConferenceSuccess>
					| ReturnType<typeof ChatActions.removeChatSuccess>,
			) => {
				const dialogIndex: number = getDialogArrayIndex(payload.id, draft);
				draft.dialogs.splice(dialogIndex, 1);
				draft.selectedDialogId = null;
				return draft;
			},
		),
	)
	.handleAction(
		MessageActions.markMessagesAsRead,
		produce((draft: DialogsState, { payload }: ReturnType<typeof MessageActions.markMessagesAsRead>) => {
			const dialogId = payload.id;
			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);
			draft.dialogs[dialogIndex].ownUnreadMessagesCount = 0;
			return draft;
		}),
	)
	.handleAction(
		MessageActions.createMessage,
		produce((draft: DialogsState, { payload }: ReturnType<typeof MessageActions.createMessage>) => {
			const { message, dialog, currentUser } = payload;

			const dialogId: number = dialog.id;

			const isDialogExists: boolean = checkDialogExists(dialogId, draft);

			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

			const isCurrentUserMessageCreator: boolean = currentUser.id === message.userCreator?.id;

			// if user already has dialogs with interlocutor - update dialog
			if (isDialogExists) {
				const isInterlocutorCurrentSelectedDialog: boolean = draft.selectedDialogId === dialogId;
				const previousOwnUnreadMessagesCount = draft.dialogs[dialogIndex].ownUnreadMessagesCount || 0;
				let ownUnreadMessagesCount =
					isInterlocutorCurrentSelectedDialog || isCurrentUserMessageCreator
						? previousOwnUnreadMessagesCount
						: previousOwnUnreadMessagesCount + 1;

				(draft.dialogs[dialogIndex].lastMessage = { ...message }),
					(draft.dialogs[dialogIndex].ownUnreadMessagesCount = ownUnreadMessagesCount);

				const dialogWithNewMessage = draft.dialogs[dialogIndex];

				draft.dialogs.splice(dialogIndex, 1);

				draft.dialogs.unshift(dialogWithNewMessage);

				return draft;
			} else {
				//if user does not have dialog with interlocutor - create dialog
				const interlocutorType: InterlocutorType = DialogService.getInterlocutorType(payload.dialog);
				let newDialog: Dialog = {
					id: dialog.id,
					interlocutorType: interlocutorType,
					conference: dialog.conference,
					lastMessage: message,
					ownUnreadMessagesCount: !isCurrentUserMessageCreator ? 1 : 0,
					interlocutorLastReadMessageId: 0,
					interlocutor: dialog.interlocutor,
				};

				draft.dialogs.unshift(newDialog);

				return draft;
			}
		}),
	)
	.handleAction(
		ChatActions.changeConferenceAvatarSuccess,
		produce((draft: DialogsState, { payload }: ReturnType<typeof ChatActions.changeConferenceAvatarSuccess>) => {
			const { conferenceId, croppedAvatarUrl } = payload;

			const dialogId: number = DialogService.getDialogIdentifier(null, conferenceId);

			const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

			const conference = draft.dialogs[dialogIndex].conference || { avatarUrl: '' };

			conference.avatarUrl = croppedAvatarUrl;

			return draft;
		}),
	)
	.handleAction(
		FriendActions.userStatusChangedEvent,
		produce((draft: DialogsState, { payload }: ReturnType<typeof FriendActions.userStatusChangedEvent>) => {
			const { status, objectId } = payload;
			const dialogId: number = DialogService.getDialogId(objectId, null);
			const isDialogExists = checkDialogExists(dialogId, draft);
			const dialogIndex = getDialogArrayIndex(dialogId, draft);

			if (!isDialogExists) {
				return draft;
			}

			const interlocutor = draft.dialogs[dialogIndex].interlocutor!;
			(interlocutor.status = status), (interlocutor.lastOnlineTime = new Date());

			return draft;
		}),
	);

export default dialogs;
