import { createReducer } from '@reduxjs/toolkit';

import { RefreshTokenFailure } from '@store/auth/features/refresh-token/refresh-token-failure';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';

import { AuthService } from '../../services/auth-service';

import { IAuthState } from './auth-state';
import { Logout } from './features/logout/logout';
import { RefreshToken } from './features/refresh-token/refresh-token';

const authService = new AuthService();
const securityTokens = authService?.securityTokens;

const initialState: IAuthState = {
  loading: false,
  isAuthenticated: Boolean(securityTokens),
  securityTokens,
  refreshTokenRequestLoading: false,
  deviceId: authService.deviceId,
};

const reducer = createReducer<IAuthState>(initialState, (builder) =>
  builder
    .addCase(Logout.action, Logout.reducer)
    .addCase(RefreshToken.action, RefreshToken.reducer)
    .addCase(RefreshTokenSuccess.action, RefreshTokenSuccess.reducer)
    .addCase(RefreshTokenFailure.action, RefreshTokenFailure.reducer),
);

export default reducer;
