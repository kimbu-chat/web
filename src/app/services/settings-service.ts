import { Langs, TypingStrategy } from 'app/store/settings/features/models';
import { IUserSettings } from 'app/store/settings/user-settings-state';
import { BrowserStorage } from 'app/utils/browser-storage';

interface IOptionalUserSettings {
  language?: Langs;
  typingStrategy?: TypingStrategy;
  notificationSound?: boolean;
}

export class SettingsService {
  private readonly userSettings = 'userSettings';

  private browserStorage = new BrowserStorage(this.userSettings);

  public get settings(): IUserSettings {
    return this.browserStorage.getObject<IUserSettings>(this.userSettings);
  }

  public initializeOrUpdate(settings: IOptionalUserSettings) {
    const currentSettings = this.browserStorage.getObject<IUserSettings>(this.userSettings);

    this.browserStorage.setObject<IUserSettings>(this.userSettings, { ...currentSettings, ...settings });
  }

  public clear() {
    this.browserStorage.clear();
  }
}
