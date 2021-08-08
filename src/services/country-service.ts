import { ICountry } from '@common/country';
import { BrowserStorage } from '@utils/browser-storage';

export class CountryService {
  private readonly userCountryKey = 'userCountry';

  private browserStorage = new BrowserStorage(this.userCountryKey);

  public get country(): ICountry {
    return this.browserStorage.getObject<ICountry>(this.userCountryKey);
  }

  public initializeOrUpdate(country: ICountry) {
    this.browserStorage.setObject<ICountry>(this.userCountryKey, country);
  }

  public clear() {
    this.browserStorage.clear();
  }
}
