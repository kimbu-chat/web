import { Logout } from './features/logout/logout';
import { RefreshTokenSuccess } from './features/refresh-token/refresh-token-success';
import { RefreshToken } from './features/refresh-token/refresh-token';

// AuthActions
export const refreshTokenAction = RefreshToken.action;
export const refreshTokenSuccessAction = RefreshTokenSuccess.action;
export const logoutAction = Logout.action;

export const AuthActions = {
  refreshTokenAction,
  refreshTokenSuccessAction,
  logoutAction,
};
