export const loadPhoneConfirmation = () => import('../pages/phone-confirmation/phone-confirmation');
export const loadCodeConfirmation = () => import('../pages/code-confirmation/code-confirmation');
export const loadMessenger = () => import('./chat/chat');
export const loadNotFound = () => import('../pages/not-found/not-found');
export const loadRegistration = () => import('../pages/registration/registration');
export const loadLogout = () => import('../pages/logout/logout');
export const loadPhotoEditor = () => import('../components/photo-editor/photo-editor');
export const loadEmoji = () =>
  import(
    '../components/message-input/message-smiles/deferred-message-smiles/deferred-message-smiles'
  );
