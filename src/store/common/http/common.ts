import { ISecurityTokens } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';

import { securityTokensSelector } from '@store/auth/selectors';

import { HttpHeaders } from './types';

export function* getAuthHeader(): SagaIterator<HttpHeaders> {
  const securityTokens: ISecurityTokens = yield select(securityTokensSelector);

  return {
    authorization: `Bearer ${securityTokens.accessToken}`,
  };
}
