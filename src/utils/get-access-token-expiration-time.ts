import jwtDecode, { JwtPayload } from 'jwt-decode';

import { SECOND_DURATION } from './constants';

export const getAccessTokenExpirationTime = (accessToken: string): string => {
  const decodedJwt = jwtDecode<JwtPayload>(accessToken);

  if (!decodedJwt?.exp) {
    throw new Error('Missing exp claim');
  }

  return new Date(decodedJwt?.exp * SECOND_DURATION).toISOString();
};
