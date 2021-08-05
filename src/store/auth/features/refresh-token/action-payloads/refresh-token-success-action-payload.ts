import { ISecurityTokens } from 'kimbu-models';

export type IRefreshTokenSuccessActionPayload = ISecurityTokens & {
  accessTokenExpirationTime: string;
};
