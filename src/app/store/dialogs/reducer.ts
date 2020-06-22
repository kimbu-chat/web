import { Dialog, DialogsActionTypes } from './types';
import { DialogActions } from './actions';

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

const dialogs = (state: DialogsState = initialState, action: ReturnType<DialogActions>): DialogsState => {
  switch (action.type) {
    // case DialogsActionTypes.INTERLOCUTOR_STOPPED_TYPING: {
    //   const { isConference, interlocutorId, objectId } = action.payload;

    //   const dialogId: number = DialogRepository.getDialogIdentifier({
    //     interlocutor: !isConference ? { id: objectId } : null,
    //     conference: isConference ? { id: interlocutorId } : null
    //   });

    //   const isDialogExists: boolean = state.dialogs.allIds.includes(dialogId);

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
    //           timeoutId: null,
    //           isInterlocutorTyping: false
    //         }
    //       }
    //     }
    //   };
    // }
    // case INTERLOCUTOR_MESSAGE_TYPING_EVENT: {
    //   const { isConference, interlocutorId, objectId } = action.payload;

    //   const dialogId: number = DialogRepository.getDialogIdentifier({
    //     interlocutor: !isConference ? { id: objectId } : null,
    //     conference: isConference ? { id: interlocutorId } : null
    //   });

    //   const isDialogExists: boolean = state.dialogs.allIds.includes(dialogId);
    //   if (!isDialogExists) {
    //     return state;
    //   }

    //   clearTimeout(state.dialogs.byId[dialogId].timeoutId);

    //   return {
    //     ...state,
    //     dialogs: {
    //       ...state.dialogs,
    //       byId: {
    //         ...state.dialogs.byId,
    //         [dialogId]: {
    //           ...state.dialogs.byId[dialogId],
    //           draftMessage: action.payload.text,
    //           timeoutId: action.payload.timeoutId,
    //           isInterlocutorTyping: true
    //         }
    //       }
    //     }
    //   };
    // }
    // case CREATE_MESSAGE_SUCCESS: {
    //   const { messageState, dialogId, newMessageId }: CreateMessageResponse = action.payload;
    //   return {
    //     ...state,
    //     dialogs: {
    //       ...state.dialogs,
    //       byId: {
    //         ...state.dialogs.byId,
    //         [dialogId]: {
    //           ...state.dialogs.byId[dialogId],
    //           lastMessage: {
    //             ...state.dialogs.byId[dialogId].lastMessage,
    //             id: newMessageId,
    //             state: messageState
    //           }
    //         }
    //       }
    //     }
    //   };
    // }
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
    // case CHANGE_SELECTED_DIALOG: {
    //   return {
    //     ...state,
    //     selectedDialogId: action.payload
    //   };
    // }
    // case UNSET_SELECTED_DIALOG: {
    //   return {
    //     ...state,
    //     selectedDialogId: null
    //   };
    // }
    // case USER_STATUS_CHANGED_EVENT: {
    //   const dialogId: number = DialogRepository.getDialogIdentifier({
    //     interlocutor: { id: action.payload.objectId }
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
        ...state,
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
        ...state,
        loading: false,
        dialogs: dialogs,
        hasMore: hasMore
      };
    }

    case DialogsActionTypes.GET_DIALOGS_FAILURE: {
      return {
        ...state,
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
      return state;
  }
};

export default dialogs;
