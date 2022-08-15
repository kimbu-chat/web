import { ISecurityTokens } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { select, put, take } from 'redux-saga/effects';

import { REQUEST_TIMEOUT } from '@common/constants';
import { RefreshToken } from '@store/auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '@store/auth/features/refresh-token/refresh-token-success';
import { securityTokensSelector } from '@store/auth/selectors';

export function* checkTokensSaga(): SagaIterator {
  const refreshTokenRequestLoading = yield select(
    (rootState: RootState) => rootState.auth?.refreshTokenRequestLoading,
  );

  if (refreshTokenRequestLoading) {
    yield take(RefreshTokenSuccess.action);
  }

  const securityTokens: ISecurityTokens & { accessTokenExpirationTime: string } = yield select(
    securityTokensSelector,
  );
  const accessTokenExpirationTime = new Date(securityTokens.accessTokenExpirationTime);

  if (!accessTokenExpirationTime) {
    throw new Error(`accessTokenExpirationTime is undefined`);
  }

  if (accessTokenExpirationTime.getTime() < new Date().getTime() - REQUEST_TIMEOUT) {
    yield put(RefreshToken.action());
    yield take(RefreshTokenSuccess.action);
  }
}
