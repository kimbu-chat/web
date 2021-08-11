import { ICountry } from '@common/country';
import { BrowserStorage } from '@utils/browser-storage';

export class CountryService {
  private readonly userCountryKey = 'userCountry';

  private browserStorage = new BrowserStorage(this.userCountryKey);

  private currentCountry: ICountry = this.browserStorage.getObject<ICountry>(this.userCountryKey);

  public get country(): ICountry {
    return this.currentCountry;
  }

  public initializeOrUpdate(country: ICountry) {
    this.browserStorage.setObject<ICountry>(this.userCountryKey, country);

    if (country.code !== this.currentCountry?.code) {
      this.currentCountry = country;
    }
  }

  public clear() {
    this.browserStorage.clear();
  }
}
