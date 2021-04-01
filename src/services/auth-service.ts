import { BrowserStorage } from '@utils/browser-storage';
import { IDeviceId, ISecurityTokens } from '@store/auth/common/models';

export class AuthService {
  private readonly authentication = 'authentication';

  private readonly deviceIdentifier = 'deviceIdentifier';

  private browserStorage = new BrowserStorage(this.authentication);

  public get securityTokens(): ISecurityTokens {
    return this.browserStorage.getObject<ISecurityTokens>(this.authentication);
  }

  public get deviceId(): IDeviceId {
    return this.browserStorage.getObject<IDeviceId>(this.deviceIdentifier);
  }

  public initialize(auth: ISecurityTokens, deviceId?: IDeviceId) {
    this.browserStorage.setObject<ISecurityTokens>(this.authentication, auth);

    if (deviceId) {
      this.browserStorage.setObject<IDeviceId>(this.deviceIdentifier, deviceId);
    }
  }

  public clear() {
    this.browserStorage.clear();
  }
}
