export const {
  REACT_APP_FILES_API,
  REACT_APP_MAIN_API,
  REACT_APP_NOTIFICATIONS_API,
} = window.__config;

export const MAIN_API = {
  VERIFY_SMS_CODE: `${REACT_APP_MAIN_API}/api/users/verify-sms-code`,
  TOKENS: `${REACT_APP_MAIN_API}/api/users/tokens`,
  LOGOUT: `${REACT_APP_MAIN_API}/api/users/logout`,
  REFRESH_TOKENS: `${REACT_APP_MAIN_API}/api/users/refresh-tokens`,
  REGISTER: `${REACT_APP_MAIN_API}/api/users/`,
  SEND_SMS_CODE: `${REACT_APP_MAIN_API}/api/users/send-sms-confirmation-code`,
  ACCEPT_CALL: `${REACT_APP_MAIN_API}/api/calls/accept-call`,
  CANCEL_CALL: `${REACT_APP_MAIN_API}/api/calls/cancel-call`,
  DECLINE_CALL: `${REACT_APP_MAIN_API}/api/calls/decline-call`,
  END_CALL: `${REACT_APP_MAIN_API}/api/calls/end-call`,
  GET_CALLS: `${REACT_APP_MAIN_API}/api/calls/search`,
  SEND_CALL_OFFER: `${REACT_APP_MAIN_API}/api/calls/send-call-offer`,
  TIMEOUT_CALL: `${REACT_APP_MAIN_API}/api/calls/mark-call-as-not-answered`,
  CALL_ENDED_EVENT: `${REACT_APP_MAIN_API}/api/calls/:callId`,
  REMOVE_CHAT: `${REACT_APP_MAIN_API}/api/dialogs/:userId?forEveryone=:forEveryone`,
  ACCEPT_RENEGOTIATION: `${REACT_APP_MAIN_API}/api/calls/accept-renegotiation`,
  SEND_ICE_CANDIDATE: `${REACT_APP_MAIN_API}/api/calls/send-ice-candidate`,
  SEND_RENEGOTIATION: `${REACT_APP_MAIN_API}/api/calls/send-renegotiation`,
  ADD_TO_GROUP_CHAT: `${REACT_APP_MAIN_API}/api/group-chats/users`,
  CHANGE_CHAT_MUTED_STATUS: `${REACT_APP_MAIN_API}/api/chats/change-muted-status`,
  GET_USER: `${REACT_APP_MAIN_API}/api/users/:userId`,
  GET_CHAT: `${REACT_APP_MAIN_API}/api/chats/:chatId`,
  CLEAR_CHAT_HISTORY: `${REACT_APP_MAIN_API}/api/chats/clear`,
  GROUP_CHAT: `${REACT_APP_MAIN_API}/api/group-chats`,
  MESSAGES: `${REACT_APP_MAIN_API}/api/messages`,
  DELETE_MESSAGES: `${REACT_APP_MAIN_API}/api/messages/delete-message-list`,
  GET_AUDIO_ATTACHMENTS: `${REACT_APP_MAIN_API}/api/audio-attachments/search`,
  GET_CHAT_INFO: `${REACT_APP_MAIN_API}/api/chats/:chatId/info`,
  GET_CHATS: `${REACT_APP_MAIN_API}/api/chats/search`,
  GET_GROUP_CHAT_USERS: `${REACT_APP_MAIN_API}/api/group-chats/search-members`,
  GET_MESSAGES: `${REACT_APP_MAIN_API}/api/messages/search`,
  GET_PHOTO_ATTACHMENTS: `${REACT_APP_MAIN_API}/api/picture-attachments/search`,
  GET_RAW_ATTACHMENTS: `${REACT_APP_MAIN_API}/api/raw-attachments/search`,
  GET_VIDEO_ATTACHMENTS: `${REACT_APP_MAIN_API}/api/video-attachments/search`,
  GET_VOICE_ATTACHMENTS: `${REACT_APP_MAIN_API}/api/voice-attachments/search`,
  LEAVE_GROUP_CHAT: `${REACT_APP_MAIN_API}/api/group-chats/:groupChatId`,
  MARK_AS_READ: `${REACT_APP_MAIN_API}/api/chats/mark-as-read`,
  REMOVE_USER_FROM_CHAT: `${REACT_APP_MAIN_API}/api/group-chats/remove-user`,
  MESSAGE_CREATED_EVENT: `${REACT_APP_MAIN_API}/api/messages/:messageId`,
  MESSAGE_DELETED_EVENT: `${REACT_APP_MAIN_API}/api/chats/:chatId/last-message`,
  ADD_CONTACT: `${REACT_APP_MAIN_API}/api/contacts`,
  DELETE_CONTACTS: `${REACT_APP_MAIN_API}/api/contacts/batch-delete`,
  DISMISS_CONTACT: `${REACT_APP_MAIN_API}/api/chats/dismiss-add-to-contacts`,
  GET_CONTACTS: `${REACT_APP_MAIN_API}/api/contacts/search`,
  GET_USER_BY_PHONE: `${REACT_APP_MAIN_API}/api/users/phone-number/:phoneNumber`,
  CHANGE_ONLINE_STATUS: `${REACT_APP_MAIN_API}/api/users/change-online-status`,
  CHECK_NICKNAME_AVAILABILITY: `${REACT_APP_MAIN_API}/api/users/check-if-nickname-is-available/:nickname`,
  GET_MY_PROFILE: `${REACT_APP_MAIN_API}/api/users/my-profile`,
  UPDATE_PROFILE: `${REACT_APP_MAIN_API}/api/users`,
  BLACK_LIST: `${REACT_APP_MAIN_API}/api/black-list`,
  USER_SESSIONS: `${REACT_APP_MAIN_API}/api/sessions`,
  REMOVE_FROM_BLACK_LIST: `${REACT_APP_MAIN_API}/api/black-list/batch-remove`,
  DEACTIVATE_ACCOUNT: `${REACT_APP_MAIN_API}/api/users/deactivate`,
};

export const NOTIFICATIONS_API = {
  OPEN_CONNECTION: `${REACT_APP_NOTIFICATIONS_API}/signalr`,
  SUBSCRIBE: `${REACT_APP_NOTIFICATIONS_API}/api/notifications/subscribe`,
  UNSUBSCRIBE: `${REACT_APP_NOTIFICATIONS_API}/api/notifications/unsubscribe`,
  MESSAGE_TYPING: `${REACT_APP_NOTIFICATIONS_API}/api/message/notify-interlocutor-about-message-typing`,
};

export const FILES_API = {
  UPLOAD_AUDIO_ATTACHMENTS: `${REACT_APP_FILES_API}/api/audio-attachments`,
  UPLOAD_PICTURE_ATTACHMENTS: `${REACT_APP_FILES_API}/api/picture-attachments`,
  UPLOAD_RAW_ATTACHMENTS: `${REACT_APP_FILES_API}/api/raw-attachments`,
  UPLOAD_VIDEO_ATTACHMENTS: `${REACT_APP_FILES_API}/api/video-attachments`,
  UPLOAD_VOICE_ATTACHMENTS: `${REACT_APP_FILES_API}/api/voice-attachments`,
  UPLOAD_AVATAR: `${REACT_APP_FILES_API}/api/avatars`,
};
