import { CancelTokenSource } from 'axios';

let avatarUploadCancelTokenSource: CancelTokenSource | undefined;

export const setAvatarUploadCancelTokenSource = (newToken: CancelTokenSource | undefined) => {
  avatarUploadCancelTokenSource = newToken;
};

export const getAvatarUploadCancelTokenSource = (): CancelTokenSource | undefined => avatarUploadCancelTokenSource;
