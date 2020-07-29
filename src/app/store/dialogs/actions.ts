import { GetDialogsActionData, Dialog, GetDialogsResponse, ConferenceCreationReqData, GetConferenceUsersRequest, AddUsersToConferenceActionData, RenameConferenceActionData, ChangeConferenceAvatarActionData, ChangeConferenceAvatarSuccessActionData } from './models';
import { IntercolutorMessageTypingIntegrationEvent } from '../middlewares/websockets/integration-events/interlocutor-message-typing-integration-event';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { createAction } from 'typesafe-actions';
import { createEmptyAction, Meta } from '../common/actions';
import { MessagesReadIntegrationEvent } from '../middlewares/websockets/integration-events/messages-read-integration-event';
import { GetConferenceUsersSuccessActionData } from '../friends/models';


// export const createMessageSuccessAction = (createMessageResponse: CreateMessageResponse) =>
//   createAction(DialogsActionTypes.CREATE_MESSAGE_SUCCESS, createMessageResponse);

// export const createMessageAction = (data: CreateMessageRequest) =>
//   createAction(DialogsActionTypes.CREATE_MESSAGE, data);

// export const userStatusChangedEventAction = (data: StatusChangedIntegrationEvent) =>
//   createAction(DialogsActionTypes.USER_STATUS_CHANGED_EVENT, data);


  export namespace ChatActions {
    export const getChats = createAction('GET_CHATS')<GetDialogsActionData>();
    export const changeSelectedChat = createAction('CHANGE_SELECTED_CHAT')<number>();
    export const getChatsSuccess = createAction('GET_CHATS_SUCCESS')<GetDialogsResponse>();
    export const getChatsFailure = createEmptyAction('GET_CHATS_FAILURE');
    export const removeChat = createAction('REMOVE_CHAT')<Dialog>();
    export const removeChatSuccess = createAction('REMOVE_CHAT_SUCCESS')<Dialog>();
    export const muteChat = createAction('MUTE_CHAT')<Dialog>();
    export const muteChatSuccess = createAction('MUTE_CHAT_SUCCESS')<Dialog>();
    export const unsetSelectedChat = createEmptyAction('UNSET_SELECTED_CHAT');
    export const createConference = createAction('CREATE_CONFERENCE')<ConferenceCreationReqData, Meta>();
    export const createConferenceSuccess = createAction('CREATE_CONFERENCE_SUCCESS')<Dialog>();
    export const createConferenceFromEvent = createAction('CREATE_CONFERENCE_FROM_EVENT')<
      ConferenceCreatedIntegrationEvent
    >();
    export const getConferenceUsers = createAction('GET_CONFERENCE_USERS')<GetConferenceUsersRequest>();
    export const getConferenceUsersSuccess = createAction('GET_CONFERENCE_USERS_SUCCESS')<GetConferenceUsersSuccessActionData>();
    export const unsetConferenceUsers = createEmptyAction('UNSET_CONFERENCE_USERS');
    export const leaveConference = createAction('LEAVE_CONFERENCE')<Dialog>();
    export const leaveConferenceSuccess = createAction('LEAVE_CONFERENCE_SUCCESS')<Dialog>();
    export const addUsersToConference = createAction('ADD_USERS_TO_CONFERENCE')<AddUsersToConferenceActionData, Meta>();
    export const addUsersToConferenceSuccess = createAction('ADD_USERS_TO_CONFERENCE_SUCCESS')<Dialog>();
  
    export const renameConference = createAction('RENAME_CONFERENCE')<RenameConferenceActionData>();
    export const renameConferenceSuccess = createAction('RENAME_CONFERENCE_SUCCESS')<RenameConferenceActionData>();
    export const changeConferenceAvatar = createAction('CHANGE_CONFERENCE_AVATAR')<ChangeConferenceAvatarActionData>();
    export const changeConferenceAvatarSuccess = createAction('CHANGE_CONFERENCE_AVATAR_SUCCESS')<
      ChangeConferenceAvatarSuccessActionData
    >();
    export const changeInterlocutorLastReadMessageId = createAction('CONFERENCE_MESSAGE_READ_FROM_EVENT')<
      MessagesReadIntegrationEvent
    >();
    export const interlocutorStoppedTyping = createAction('INTERLOCUTOR_STOPPED_TYPING')<
      IntercolutorMessageTypingIntegrationEvent
    >();
    export const interlocutorMessageTyping = createAction('INTERLOCUTOR_MESSAGE_TYPING_EVENT')<
      IntercolutorMessageTypingIntegrationEvent
    >();
  }
  