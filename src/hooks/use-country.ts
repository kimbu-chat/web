import { useState, useEffect } from 'react';

import { ICountry } from '@common/country';
import { CountryService } from '@services/country-service';
import { getCountryList } from '@utils/get-country-list';
import { getCountry } from '@utils/get-country';

let cancelLoad: () => void;

export const useCountry = () => {
  const [countries, setCountries] = useState<ICountry[]>([
    { code: 'AF', number: '+93', title: 'Afghanistan' },
  ]);
  const [country, setCountry] = useState<ICountry>({
    code: 'AF',
    number: '+93',
    title: 'Afghanistan',
  });

  useEffect(() => {
    (async () => {
      try {
        const { loadCountryList, cancelLoadCountryList } = getCountryList();
        cancelLoad = cancelLoadCountryList;
        const loadedCountries = await loadCountryList();
        setCountries(loadedCountries);
        let countryOfResidence =
          loadedCountries?.find(({ code }) => code === new CountryService().country) ||
          loadedCountries[0];
        setCountry(countryOfResidence || loadedCountries[0]);

        const { loadCountry, cancelLoadCountry } = getCountry();
        cancelLoad = cancelLoadCountry;
        const countryCode = await loadCountry();

        countryOfResidence =
          loadedCountries?.find(({ code }) => code === countryCode) || loadedCountries[0];

        if (countryOfResidence) {
          setCountry(countryOfResidence);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    })();

    return () => {
      if (cancelLoad) {
        cancelLoad();
      }
    };
  }, []);

  return { countries, setCountry, country };
};
