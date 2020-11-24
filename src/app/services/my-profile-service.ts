import { BrowserStorage } from 'utils/functions/browser-storage';
import { UserPreview } from 'store/my-profile/models';

export class MyProfileService {
	private readonly myProfileStorageKey = 'my-profile';
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
