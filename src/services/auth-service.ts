import { ISecurityTokens } from 'kimbu-models';

import { BrowserStorage } from '@utils/browser-storage';
import { getAccessTokenExpirationTime } from '@utils/get-access-token-expiration-time';

export class AuthService {
  private readonly authentication = 'authentication';

  private readonly deviceIdentifier = 'deviceIdentifier';

  private browserStorage = new BrowserStorage(this.authentication);

  public get securityTokens(): ISecurityTokens {
    const tokens = this.browserStorage.getObject<ISecurityTokens>(this.authentication);

    if (tokens) {
      const refreshTokenExpirationTime = getAccessTokenExpirationTime(tokens.accessToken ?? '');
      return {
        ...tokens,
        refreshTokenExpirationTime,
      };
    }

    return tokens;
  }

  public get deviceId(): string {
    return this.browserStorage.getObject<string>(this.deviceIdentifier);
  }

  public initialize(auth: ISecurityTokens, deviceId?: string) {
    this.browserStorage.setObject<ISecurityTokens>(this.authentication, auth);

    if (deviceId) {
      this.browserStorage.setObject<string>(this.deviceIdentifier, deviceId);
    }
  }

  public clear() {
    this.browserStorage.clear();
  }
}
