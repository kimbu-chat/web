import { Logout } from '@store/auth/features/logout/logout';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';
import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';

export const refreshTokenAction = RefreshToken.action;
export const refreshTokenSuccessAction = RefreshTokenSuccess.action;
export const logoutAction = Logout.action;
