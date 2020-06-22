import { BrowserStorage } from 'app/utils/browser-storage';
import { UserAuthData } from 'app/store/auth/types';

export class AuthService {
  private readonly authentication = 'authentication';
  private browserStorage = new BrowserStorage(this.authentication);

  public get auth(): UserAuthData {
    return this.browserStorage.getObject<UserAuthData>(this.authentication);
  }

  public initialize(auth: UserAuthData) {
    this.browserStorage.setObject<UserAuthData>(this.authentication, auth);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
