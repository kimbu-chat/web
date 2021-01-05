import { ILoginApiResponse } from '../features/confirm-phone/api-requests/login-api-response';

export interface ISecurityTokens extends ILoginApiResponse {
  refreshTokenRequestLoading?: boolean;
  isAuthenticated?: boolean;
}
