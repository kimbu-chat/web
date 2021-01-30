import { BrowserStorage } from 'app/utils/browser-storage';
import { IUser } from 'app/store/common/models';

export class MyProfileService {
  private readonly myProfileStorageKey = 'profile';

  private browserStorage = new BrowserStorage(this.myProfileStorageKey);

  public get myProfile(): IUser {
    return this.browserStorage.getObject<IUser>(this.myProfileStorageKey);
  }

  public setMyProfile(profile: IUser) {
    this.browserStorage.setObject<IUser>(this.myProfileStorageKey, profile);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
