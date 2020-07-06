import { Dialog, DialogsActionTypes } from './types';
import produce from 'immer';
import { DialogActions } from './actions';
import { DialogService } from './dialog-service';
import { CreateMessageResponse } from '../messages/interfaces';
import { InterlocutorType } from './types';

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

      // case ADD_USERS_TO_CONFERENCE_SUCCESS: {
      //   const { id } = action.payload;

      //   return {
      //     ...draft,
      //     dialogs: {
      //       ...draft.dialogs,
      //       byId: {
      //         ...draft.dialogs.byId,
      //         [id]: {
      //           ...draft.dialogs.byId[id],
      //           conference: {
      //             ...draft.dialogs.byId[id].conference,
      //             membersCount: draft.dialogs.byId[id].conference.membersCount + 1
      //           }
      //         }
      //       }
      //     }
      //   };
      // }
      // case MUTE_DIALOG_SUCCESS: {
      //   const { id } = action.payload;

      //   return {

      //     ...draft,
      //     dialogs: {
      //       ...draft.dialogs,
      //       byId: {
      //         ...draft.dialogs.byId,
      //         [id]: {
      //           ...draft.dialogs.byId[id],
      //           isMuted: !draft.dialogs.byId[id].isMuted
      //         }
      //       }
      //     }
      //   };
      // }
      // case RENAME_CONFERENCE_SUCCESS: {
      //   const { dialog, newName }: RenameConferenceActionData = action.payload;
      //   const { id } = dialog;
      //   return {
      //     ...draft,
      //     dialogs: {
      //       ...draft.dialogs,
      //       byId: {
      //         ...draft.dialogs.byId,
      //         [id]: {
      //           ...draft.dialogs.byId[id],
      //           conference: {
      //             ...draft.dialogs.byId[id].conference,
      //             name: newName
      //           }
      //         }
      //       }
      //     }
      //   };
      // }
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
        // if (initializedBySearch) {
        //   return {
        //     ...draft,
        //     loading: isFromLocalDb,
        //     dialogs: dialogs,
        //     hasMore: hasMore
        //   };
        // }

        // const orderedByDatetimeAllIds: number[] = normalizedDialogList.allIds.sort((a, b) => {
        //   const first = new Date(normalizedDialogList.byId[a].lastMessage.creationDateTime).getTime();
        //   const second = new Date(normalizedDialogList.byId[b].lastMessage.creationDateTime).getTime();
        //   return first > second ? -1 : first < second ? 1 : 0;
        // });

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
      // case LEAVE_CONFERENCE_SUCCESS:
      // case REMOVE_DIALOG_SUCCESS: {
      //   return {
      //     ...draft,
      //     dialogs: {
      //       ...draft.dialogs,
      //       // just remove id from allIds and item in the flatlist will fade away
      //       allIds: draft.dialogs.allIds.filter(x => x !== action.payload.id)
      //     }
      //   };
      // }
      // case RESET_UNREAD_MESSAGES_COUNT: {
      //   const dialogId = action.payload.id;
      //   return {
      //     ...draft,
      //     dialogs: {
      //       ...draft.dialogs,
      //       byId: {
      //         ...draft.dialogs.byId,
      //         [dialogId]: {
      //           ...draft.dialogs.byId[dialogId],
      //           ownUnreadMessagesCount: 0
      //         }
      //       }
      //     }
      //   };
      // }

      case DialogsActionTypes.CREATE_MESSAGE: {
        const { message, dialog, currentUser } = action.payload;

        const dialogId: number = dialog.id;

        const isDialogExists: boolean = checkDialogExists(dialogId, draft);

        const dialogIndex: number = getDialogArrayIndex(dialogId, draft);

        const isCurrentUserMessageCreator: boolean = currentUser.id === message.userCreator?.id;

        // if user already has dialogs with interlocutor - update dialog
        if (isDialogExists) {
          const isInterlocutorCurrentSelectedDialog: boolean = draft.selectedDialogId === dialogId;
          const previousOwnUnreadMessagesCount = draft.dialogs[dialogIndex].ownUnreadMessagesCount;
          let ownUnreadMessagesCount;
          if (previousOwnUnreadMessagesCount)
            ownUnreadMessagesCount =
              isInterlocutorCurrentSelectedDialog || isCurrentUserMessageCreator
                ? previousOwnUnreadMessagesCount
                : previousOwnUnreadMessagesCount + 1;

          (draft.dialogs[dialogIndex].lastMessage = { ...message }),
            (draft.dialogs[dialogIndex].ownUnreadMessagesCount = ownUnreadMessagesCount);

          const dialogWithNewMessage = draft.dialogs[dialogIndex];

          draft.dialogs.splice(dialogIndex);

          const id = draft.dialogs.unshift(dialogWithNewMessage);

          console.log(id);

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

          draft.dialogs.push(newDialog);

          return draft;
        }
      }
      default:
        return draft;
    }
  }
);

export default dialogs;
