import { Dialog, DialogsActionTypes } from './types';
import { ConferencesActionTypes } from '../conferences/types';
import { MessagesActionTypes } from '../messages/types';
import produce from 'immer';
import { DialogActions } from './actions';
import { DialogService } from './dialog-service';
import { CreateMessageResponse } from '../messages/interfaces';
import { InterlocutorType, RenameConferenceActionData } from './types';

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
  selectedDialogId: null
};

const checkDialogExists = (dialogId: number, state: DialogsState): boolean =>
  Boolean(state.dialogs.find(({ id }) => id === dialogId));

const getDialogArrayIndex = (dialogId: number, state: DialogsState): number =>
  state.dialogs.findIndex(({ id }) => id === dialogId);

const dialogs = produce(
  (draft: DialogsState = initialState, action: ReturnType<DialogActions>): DialogsState => {
    switch (action.type) {
      case DialogsActionTypes.INTERLOCUTOR_STOPPED_TYPING: {
        const { isConference, interlocutorId, objectId } = action.payload;

        const dialogId: number = DialogService.getDialogIdentifier(
          !isConference ? objectId : null,
          isConference ? interlocutorId : null
        );

        const isDialogExists: boolean = checkDialogExists(dialogId, draft);

        if (!isDialogExists) {
          return draft;
        }

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

        (draft.dialogs[dialogIndex].timeoutId = null), (draft.dialogs[dialogIndex].isInterlocutorTyping = false);

        return draft;
      }

      case DialogsActionTypes.INTERLOCUTOR_MESSAGE_TYPING_EVENT: {
        const { isConference, interlocutorId, objectId } = action.payload;

        const dialogId: number = DialogService.getDialogIdentifier(
          !isConference ? objectId : null,
          isConference ? interlocutorId : null
        );

        const isDialogExists: boolean = checkDialogExists(dialogId, draft);

        if (!isDialogExists) {
          return draft;
        }

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

        clearTimeout(draft.dialogs[dialogIndex].timeoutId);

        (draft.dialogs[dialogIndex].draftMessage = action.payload.text),
          (draft.dialogs[dialogIndex].timeoutId = action.payload.timeoutId),
          (draft.dialogs[dialogIndex].isInterlocutorTyping = true);

        return draft;
      }

      case DialogsActionTypes.CREATE_MESSAGE_SUCCESS: {
        const { dialogId, newMessageId }: CreateMessageResponse = action.payload;

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

        draft.dialogs[dialogIndex].lastMessage.id = newMessageId;

        return draft;
      }

      case ConferencesActionTypes.CREATE_CONFERENCE_SUCCESS: {
        const newDialog = action.payload;

        const isDialogExists: boolean = checkDialogExists(newDialog.id, draft);

        if (!isDialogExists) {
          draft.dialogs.unshift(newDialog);
          return draft;
        }

        return draft;
      }

      case ConferencesActionTypes.ADD_USERS_TO_CONFERENCE_SUCCESS: {
        const { id } = action.payload;

        const dialogIndex: number = getDialogArrayIndex(id, draft);

        const conference = draft.dialogs[dialogIndex].conference || { membersCount: 0 };

        conference.membersCount = (conference.membersCount || 0) + 1;

        return draft;
      }

      case DialogsActionTypes.MUTE_DIALOG_SUCCESS: {
        const { id } = action.payload;

        const dialogIndex: number = getDialogArrayIndex(id, draft);

        draft.dialogs[dialogIndex].isMuted = !draft.dialogs[dialogIndex].isMuted;

        return draft;
      }

      case ConferencesActionTypes.RENAME_CONFERENCE_SUCCESS: {
        const { dialog, newName }: RenameConferenceActionData = action.payload;
        const { id } = dialog;

        const dialogIndex: number = getDialogArrayIndex(id, draft);

        const conference = draft.dialogs[dialogIndex].conference || { name: '' };

        conference.name = newName;
        return draft;
      }

      // case CONFERENCE_MESSAGE_READ_FROM_EVENT:
      // case USER_MESSAGE_READ_FROM_EVENT: {
      //   const { lastReadMessageId, userReaderId, conferenceId } = action.payload;

      //   const isConference: boolean = Boolean(conferenceId);

      //   //Currently disabled for conferences
      //   if (isConference) {
      //     return draft;
      //   }

      //   const dialogId: number = DialogRepository.getDialogIdentifier({
      //     interlocutor: !isConference ? { id: userReaderId } : null,
      //     conference: isConference ? { id: conferenceId } : null
      //   });

      //   const isDialogExists = draft.dialogs.allIds.includes(dialogId);
      //   // if user already has dialogs with interlocutor - update dialog
      //   if (isDialogExists) {
      //     return {
      //       ...draft,
      //       dialogs: {
      //         ...draft.dialogs,
      //         byId: {
      //           ...draft.dialogs.byId,
      //           [dialogId]: {
      //             ...draft.dialogs.byId[dialogId],
      //             interlocutorLastReadMessageId: lastReadMessageId
      //           }
      //         }
      //       }
      //     };
      //   } else {

      //     return draft;
      //   }
      // }
      case DialogsActionTypes.CHANGE_SELECTED_DIALOG: {
        return {
          ...draft,
          selectedDialogId: action.payload
        };
      }
      case DialogsActionTypes.UNSET_SELECTED_DIALOG: {
        return {
          ...draft,
          selectedDialogId: null
        };
      }

      case DialogsActionTypes.USER_STATUS_CHANGED_EVENT: {
        const dialogId: number = DialogService.getDialogId(action.payload.objectId, null);
        const isDialogExists = checkDialogExists(dialogId, draft);
        const dialogIndex = getDialogArrayIndex(dialogId, draft);

        if (!isDialogExists) {
          return draft;
        }

        const interlocutor = draft.dialogs[dialogIndex].interlocutor || {};

        (interlocutor.status = action.payload.status), (interlocutor.lastOnlineTime = new Date());

        return draft;
      }

      case DialogsActionTypes.GET_DIALOGS: {
        return {
          ...draft,
          loading: true
        };
      }
      case DialogsActionTypes.GET_DIALOGS_SUCCESS: {
        const { dialogs, hasMore } = action.payload;

        return {
          ...draft,
          loading: false,
          dialogs: dialogs,
          hasMore: hasMore
        };
      }

      case DialogsActionTypes.GET_DIALOGS_FAILURE: {
        return {
          ...draft,
          loading: false
        };
      }
      case ConferencesActionTypes.LEAVE_CONFERENCE_SUCCESS:
      case DialogsActionTypes.REMOVE_DIALOG_SUCCESS: {
        const dialogIndex: number = getDialogArrayIndex(action.payload.id, draft);
        draft.dialogs.splice(dialogIndex, 1);
        draft.selectedDialogId = null;
        return draft;
      }

      case MessagesActionTypes.RESET_UNREAD_MESSAGES_COUNT: {
        const dialogId = action.payload.id;

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);
        draft.dialogs[dialogIndex].ownUnreadMessagesCount = 0;
        return draft;
      }

      case DialogsActionTypes.CREATE_MESSAGE: {
        const { message, dialog, currentUser } = action.payload;

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
          const interlocutorType: InterlocutorType = DialogService.getInterlocutorType(action.payload.dialog);
          let newDialog: Dialog = {
            id: dialog.id,
            interlocutorType: interlocutorType,
            conference: dialog.conference,
            lastMessage: message,
            ownUnreadMessagesCount: !isCurrentUserMessageCreator ? 1 : 0,
            interlocutorLastReadMessageId: 0,
            interlocutor: dialog.interlocutor
          };

          draft.dialogs.unshift(newDialog);

          return draft;
        }
      }

      case ConferencesActionTypes.CHANGE_CONFERENCE_AVATAR_SUCCESS: {
        const { conferenceId, croppedAvatarUrl } = action.payload;

        const dialogId: number = DialogService.getDialogIdentifier(null, conferenceId);

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

        const conference = draft.dialogs[dialogIndex].conference || { avatarUrl: '' };

        conference.avatarUrl = croppedAvatarUrl;

        return draft;
      }

      default:
        return draft;
    }
  }
);

export default dialogs;
