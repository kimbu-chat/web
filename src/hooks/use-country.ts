import { useState, useEffect } from 'react';

import { ICountry } from '@common/country';
import { CountryService } from '@services/country-service';
import { getCountryList } from '@utils/get-country-list';
import { getUserCountryCode } from '@utils/get-user-country-code';

let cancelLoad: () => void;

const defaultCountry: ICountry = { code: 'AF', number: '+93', title: 'Afghanistan' };

export const useCountry = () => {
  const defaultUserCountry: ICountry = CountryService.country || defaultCountry;
  const [countries, setCountries] = useState<ICountry[]>([defaultUserCountry]);
  const [country, setCountry] = useState<ICountry>(defaultUserCountry);

  useEffect(() => {
    (async () => {
      try {
        setCountry(defaultUserCountry);

        const { loadCountryList, cancelLoadCountryList } = getCountryList();
        cancelLoad = cancelLoadCountryList;
        const loadedCountries = await loadCountryList();

        setCountries(loadedCountries);

        const { loadCountry, cancelLoadCountry } = getUserCountryCode();

        cancelLoad = cancelLoadCountry;

        const countryCode = await loadCountry();

        const countryOfResidence = loadedCountries.find(({ code }) => code === countryCode);

        if (countryOfResidence && countryOfResidence.code !== defaultUserCountry.code) {
          setCountry(countryOfResidence);
          CountryService.initializeOrUpdate(countryOfResidence);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    })();

    return () => {
      if (cancelLoad) {
        cancelLoad();
      }
    };
  }, [defaultUserCountry]);

  return { countries, setCountry, country };
};
