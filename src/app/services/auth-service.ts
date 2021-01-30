import { BrowserStorage } from 'app/utils/browser-storage';
import { ISecurityTokens } from 'app/store/auth/common/models';

export class AuthService {
  private readonly authentication = 'authentication';

  private browserStorage = new BrowserStorage(this.authentication);

  public get securityTokens(): ISecurityTokens {
    return this.browserStorage.getObject<ISecurityTokens>(this.authentication);
  }

  public initialize(auth: ISecurityTokens) {
    this.browserStorage.setObject<ISecurityTokens>(this.authentication, auth);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
