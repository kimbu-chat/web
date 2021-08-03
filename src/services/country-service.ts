import { BrowserStorage } from '@utils/browser-storage';

export class CountryService {
  private readonly userCountry = 'userCountry';

  private browserStorage = new BrowserStorage(this.userCountry);

  public get country(): string {
    return this.browserStorage.getObject<string>(this.userCountry);
  }

  public initializeOrUpdate(country: string) {
    this.browserStorage.setObject<string>(this.userCountry, country);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
