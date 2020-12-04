import { CancelTokenSource } from 'axios';

export let avatarUploadCancelTokenSource: CancelTokenSource | undefined;

export const setAvatarUploadCancelTokenSource = (newToken: CancelTokenSource | undefined) => {
  avatarUploadCancelTokenSource = newToken;
};
