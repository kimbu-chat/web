import { Dialog, DialogsActionTypes } from './types';
import produce from 'immer';
import { DialogActions } from './actions';
import { CreateMessageResponse } from '../messages/interfaces';

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

const checkIfDialogExists = (state: DialogsState, dialogId: number): boolean =>
  Boolean(state.dialogs.find(({ id }) => id === dialogId));

const getDialogIndex = (state: DialogsState, dialogId: number): number =>
  state.dialogs.findIndex(({ id }) => id === dialogId);

const dialogs = produce(
  (draft: DialogsState = initialState, action: ReturnType<DialogActions>): DialogsState => {
    switch (action.type) {
      case DialogsActionTypes.INTERLOCUTOR_STOPPED_TYPING: {
        const { id: dialogId } = action.payload;

        const isDialogExists: boolean = checkIfDialogExists(draft, dialogId);

        if (!isDialogExists) {
          return draft;
        }

        const dialogIndex = getDialogIndex(draft, dialogId);

        (draft.dialogs[dialogIndex].isInterlocutorTyping = false), (draft.dialogs[dialogIndex].timeoutId = null);

        return draft;
      }

      case DialogsActionTypes.INTERLOCUTOR_MESSAGE_TYPING_EVENT: {
        const { id: dialogId } = action.payload;

        const isDialogExists: boolean = checkIfDialogExists(draft, dialogId);

        if (!isDialogExists) {
          return draft;
        }

        const dialogIndex = getDialogIndex(draft, dialogId);

        clearTimeout(draft.dialogs[dialogIndex].timeoutId);

        (draft.dialogs[dialogIndex].isInterlocutorTyping = true),
          (draft.dialogs[dialogIndex].timeoutId = action.payload.timeoutId),
          (draft.dialogs[dialogIndex].draftMessage = action.payload.text);

        return draft;
      }

      case CREATE_MESSAGE_SUCCESS: {
        const { messageState, dialogId, newMessageId }: CreateMessageResponse = action.payload;

        const dialogIndex = getDialogIndex(draft, dialogId);

        draft.dialogs[dialogIndex].lastMessage.id = newMessageId;
        draft.dialogs[dialogIndex].state = messageState;
        return {
          ...state,
          dialogs: {
            ...state.dialogs,
            byId: {
              ...state.dialogs.byId,
              [dialogId]: {
                ...state.dialogs.byId[dialogId],
                lastMessage: {
                  ...state.dialogs.byId[dialogId].lastMessage,
                  id: newMessageId,
                  state: messageState
                }
              }
            }
          }
        };
      }

      // case ADD_USERS_TO_CONFERENCE_SUCCESS: {
      //   const { id } = action.payload;

      //   return {
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       byId: {
      //         ...state.dialogs.byId,
      //         [id]: {
      //           ...state.dialogs.byId[id],
      //           conference: {
      //             ...state.dialogs.byId[id].conference,
      //             membersCount: state.dialogs.byId[id].conference.membersCount + 1
      //           }
      //         }
      //       }
      //     }
      //   };
      // }
      // case MUTE_DIALOG_SUCCESS: {
      //   const { id } = action.payload;

      //   return {
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       byId: {
      //         ...state.dialogs.byId,
      //         [id]: {
      //           ...state.dialogs.byId[id],
      //           isMuted: !state.dialogs.byId[id].isMuted
      //         }
      //       }
      //     }
      //   };
      // }
      // case RENAME_CONFERENCE_SUCCESS: {
      //   const { dialog, newName }: RenameConferenceActionData = action.payload;
      //   const { id } = dialog;

      //   return {
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       byId: {
      //         ...state.dialogs.byId,
      //         [id]: {
      //           ...state.dialogs.byId[id],
      //           conference: {
      //             ...state.dialogs.byId[id].conference,
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
      //     return state;
      //   }

      //   const dialogId: number = DialogRepository.getDialogIdentifier({
      //     interlocutor: !isConference ? { id: userReaderId } : null,
      //     conference: isConference ? { id: conferenceId } : null
      //   });

      //   const isDialogExists = state.dialogs.allIds.includes(dialogId);
      //   // if user already has dialogs with interlocutor - update dialog
      //   if (isDialogExists) {
      //     return {
      //       ...state,
      //       dialogs: {
      //         ...state.dialogs,
      //         byId: {
      //           ...state.dialogs.byId,
      //           [dialogId]: {
      //             ...state.dialogs.byId[dialogId],
      //             interlocutorLastReadMessageId: lastReadMessageId
      //           }
      //         }
      //       }
      //     };
      //   } else {
      //     return state;
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
      // case USER_STATUS_CHANGED_EVENT: {
      //   const dialogId: number = DialogRepository.getDialogIdentifier({
      //     interlocutor: { id: action.payload.id }
      //   });
      //   const isDialogExists = state.dialogs.allIds.includes(dialogId);

      //   if (!isDialogExists) {
      //     return state;
      //   }

      //   return {
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       byId: {
      //         ...state.dialogs.byId,
      //         [dialogId]: {
      //           ...state.dialogs.byId[dialogId],
      //           interlocutor: {
      //             ...state.dialogs.byId[dialogId].interlocutor,
      //             status: action.payload.status,
      //             lastOnlineTime: new Date()
      //           }
      //         }
      //       }
      //     }
      //   };
      // }
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
        //     ...state,
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
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       // just remove id from allIds and item in the flatlist will fade away
      //       allIds: state.dialogs.allIds.filter(x => x !== action.payload.id)
      //     }
      //   };
      // }
      // case RESET_UNREAD_MESSAGES_COUNT: {
      //   const dialogId = action.payload.id;
      //   return {
      //     ...state,
      //     dialogs: {
      //       ...state.dialogs,
      //       byId: {
      //         ...state.dialogs.byId,
      //         [dialogId]: {
      //           ...state.dialogs.byId[dialogId],
      //           ownUnreadMessagesCount: 0
      //         }
      //       }
      //     }
      //   };
      // }
      // case CREATE_MESSAGE: {
      //   const { message, dialog, currentUser } = action.payload;
      //   const dialogId: number = dialog.id;
      //   const isDialogExists = state.dialogs.allIds.includes(dialogId);
      //   const isCurrentUserMessageCreator: boolean = currentUser.id === message.userCreator?.id;
      //   // if user already has dialogs with interlocutor - update dialog
      //   if (isDialogExists) {
      //     const isInterlocutorCurrentSelectedDialog: boolean = state.selectedDialogId === dialogId;
      //     const previousOwnUnreadMessagesCount: number = state.dialogs.byId[dialogId].ownUnreadMessagesCount;
      //     const ownUnreadMessagesCount: number =
      //       isInterlocutorCurrentSelectedDialog || isCurrentUserMessageCreator ? previousOwnUnreadMessagesCount : previousOwnUnreadMessagesCount + 1;

      //     return {
      //       ...state,
      //       dialogs: {
      //         ...state.dialogs,
      //         byId: {
      //           ...state.dialogs.byId,
      //           [dialogId]: {
      //             ...state.dialogs.byId[dialogId],
      //             ownUnreadMessagesCount: ownUnreadMessagesCount,
      //             lastMessage: { ...message }
      //           }
      //         },
      //         // delete dialog id from array and push into beginning of array to make dialog to appear at the top
      //         allIds: [dialogId].concat(state.dialogs.allIds.filter(x => x !== dialogId))
      //       }
      //     };
      //   } else {
      //     //if user does not have dialog with interlocutor - create dialog
      //     const interlocutorType: InterlocutorType = DialogRepository.getInterlocutorType(action.payload.dialog);
      //     let newDialog: Dialog = {
      //       id: dialog.id,
      //       interlocutorType: interlocutorType,
      //       conference: dialog.conference,
      //       lastMessage: message,
      //       ownUnreadMessagesCount: !isCurrentUserMessageCreator ? 1 : 0,
      //       interlocutorLastReadMessageId: 0,
      //       interlocutor: dialog.interlocutor
      //     };

      //     return {
      //       ...state,
      //       dialogs: {
      //         ...state.dialogs,
      //         byId: {
      //           ...state.dialogs.byId,
      //           [dialogId]: newDialog
      //         },
      //         allIds: [dialog.id].concat(state.dialogs.allIds)
      //       }
      //     };
      //   }
      // }
      default:
        return draft;
    }
  }
);

export default dialogs;
