import { BrowserStorage } from 'app/utils/browser-storage';
import { UserSettings, OptionalUserSettings } from '../store/settings/models';

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
