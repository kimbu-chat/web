import { ICountry } from '@common/country';
import { BrowserStorage } from '@utils/browser-storage';

export class CountryService {
  private static readonly userCountryKey = 'userCountry';

  private static browserStorage = new BrowserStorage(CountryService.userCountryKey);

  private static currentCountry: ICountry = CountryService.browserStorage.getObject<ICountry>(
    CountryService.userCountryKey,
  );

  public static get country(): ICountry {
    return this.currentCountry;
  }

  public static initializeOrUpdate(country: ICountry) {
    if (country.code !== this.currentCountry?.code) {
      this.browserStorage.setObject<ICountry>(this.userCountryKey, country);
      this.currentCountry = country;
    }
  }

  public static clear() {
    CountryService.browserStorage.clear();
  }
}
