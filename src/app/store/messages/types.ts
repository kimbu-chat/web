export enum MessagesActionTypes {
    GET_MESSAGES = 'GET_MESSAGES',                                              
    GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS',
    GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE',
    SEND_MESSAGE = 'SEND_MESSAGE',
    SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
    SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE',
    CREATE_MESSAGE = 'CREATE_MESSAGE',
    CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS',
    NOTIFY_USER_ABOUT_MESSAGE_TYPING = 'NOTIFY_USER_ABOUT_MESSAGE_TYPING',
    INTERLOCUTOR_MESSAGE_TYPING_EVENT = 'INTERLOCUTOR_MESSAGE_TYPING_EVENT',
    INTERLOCUTOR_STOPPED_TYPING = 'INTERLOCUTOR_STOPPED_TYPING',
    RESET_UNREAD_MESSAGES_COUNT = 'RESET_UNREAD_MESSAGES_COUNT',
    USER_MESSAGE_READ_FROM_EVENT = 'USER_MESSAGE_READ_FROM_EVENT',
    CONFERENCE_MESSAGE_READ_FROM_EVENT = 'CONFERENCE_MESSAGE_READ_FROM_EVENT'
  }
