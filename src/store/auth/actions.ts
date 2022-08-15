import { Logout } from '@store/auth/features/logout/logout';
import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';

export const refreshTokenAction = RefreshToken.action;
export const refreshTokenSuccessAction = RefreshTokenSuccess.action;
export const logoutAction = Logout.action;
