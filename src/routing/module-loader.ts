export const loadPhoneConfirmation = () =>
  import('../components/login-page/phone-confirmation/phone-confirmation');
export const loadCodeConfirmation = () =>
  import('../components/login-page/code-confirmation/code-confirmation');
export const loadMessenger = () => import('../containers/chat/chat');
export const loadNotFound = () => import('../containers/not-found/not-found');
export const loadRegistration = () => import('../containers/registration/registration');
export const loadLogout = () => import('../components/login-page/logout/logout');
export const loadPhotoEditor = () =>
  import('../components/messenger-page/photo-editor/photo-editor');
export const loadEmoji = () =>
  import(
    '../components/messenger-page/message-input/message-smiles/deferred-message-smiles/deferred-message-smiles'
  );
