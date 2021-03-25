import { IOptionalUserSettings } from '@app/store/settings/comon/models/optional-user-settings';
import { IUserSettings } from '../store/settings/user-settings-state';
import { BrowserStorage } from '../utils/browser-storage';

export class SettingsService {
  private readonly userSettings = 'userSettings';

  private browserStorage = new BrowserStorage(this.userSettings);

  public get settings(): IUserSettings {
    return this.browserStorage.getObject<IUserSettings>(this.userSettings);
  }

  public initializeOrUpdate(settings: IOptionalUserSettings) {
    const currentSettings = this.browserStorage.getObject<IUserSettings>(this.userSettings);

    this.browserStorage.setObject<IUserSettings>(this.userSettings, {
      ...currentSettings,
      ...settings,
    });
  }

  public clear() {
    this.browserStorage.clear();
  }
}
