import { BrowserStorage } from 'app/utils/browser-storage';
import { UserPreview } from 'app/store/contacts/types';

export class MyProfileService {
  private readonly myProfileStorageKey = 'my-profile-storage-key';
  private browserStorage = new BrowserStorage(this.myProfileStorageKey);

  public get myProfile(): UserPreview {
    return this.browserStorage.getObject<UserPreview>(this.myProfileStorageKey);
  }

  public setMyProfile(profile: UserPreview) {
    this.browserStorage.setObject<UserPreview>(this.myProfileStorageKey, profile);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
