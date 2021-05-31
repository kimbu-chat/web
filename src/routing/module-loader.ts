export const loadLogin = () => import('@pages/login/login');
export const loadMessenger = () => import('./chat/chat');
export const loadNotFound = () => import('@pages/not-found/not-found');
export const loadLogout = () => import('@pages/logout/logout');
export const loadPhotoEditor = () => import('@components/photo-editor/photo-editor');
export const loadEmoji = () =>
  import(
    '@components/message-input/message-smiles/deferred-message-smiles/deferred-message-smiles'
  );
