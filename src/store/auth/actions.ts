import { RefreshTokenFailure } from '@store/auth/features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';

// import { Logout } from './features/logout/logout';
// import { RefreshToken } from './features/refresh-token/refresh-token';
// import { SessionTerminatedEventHandler } from './socket-events/session-terminated/session-terminated-event-handler';


// AuthActions
// export const refreshTokenAction = RefreshToken.action;
export const refreshTokenSuccessAction = RefreshTokenSuccess.action;
// export const logoutAction = Logout.action;
// export const sessionTerminatedEventHandler = SessionTerminatedEventHandler.action;
export const refreshTokenFailureAction = RefreshTokenFailure.action;

export type AuthActions = // typeof refreshTokenAction &
  typeof refreshTokenSuccessAction &
  // typeof logoutAction &
  // typeof sessionTerminatedEventHandler & 
  typeof refreshTokenFailureAction;
