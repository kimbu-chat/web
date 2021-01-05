import { BrowserStorage } from 'app/utils/browser-storage';
import { IUserPreview } from 'app/store/models';

export class MyProfileService {
  private readonly myProfileStorageKey = 'my-profile';

  private browserStorage = new BrowserStorage(this.myProfileStorageKey);

  public get myProfile(): IUserPreview {
    return this.browserStorage.getObject<IUserPreview>(this.myProfileStorageKey);
  }

  public setMyProfile(profile: IUserPreview) {
    this.browserStorage.setObject<IUserPreview>(this.myProfileStorageKey, profile);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
