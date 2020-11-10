import { UserSettings, OptionalUserSettings } from './../store/settings/models';
import { BrowserStorage } from 'app/utils/functions/browser-storage';

export class SettingsService {
	private readonly userSettings = 'userSettings';
	private browserStorage = new BrowserStorage(this.userSettings);

	public get settings(): UserSettings {
		return this.browserStorage.getObject<UserSettings>(this.userSettings);
	}

	public initializeOrUpdate(settings: OptionalUserSettings) {
		const currentSettings = this.browserStorage.getObject<UserSettings>(this.userSettings);

		this.browserStorage.setObject<UserSettings>(this.userSettings, { ...currentSettings, ...settings });
	}

	public clear() {
		this.browserStorage.clear();
	}
}
