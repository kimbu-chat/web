import { useState, useEffect } from 'react';

import axios from 'axios';

import { ICountry } from '@common/country';
import { CountryService } from '@services/country-service';

let loadedCountries: ICountry[];

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
    const { CancelToken } = axios;
    const source = CancelToken.source();

    (async () => {
      try {
        if (!loadedCountries) {
          const loadedCountriesResponse = await axios.get(`/countries.json`, {
            cancelToken: source.token,
          });

          loadedCountries = loadedCountriesResponse.data;
        }

        setCountries(loadedCountries);
        let countryOfResidence =
          loadedCountries?.find(({ code }) => code === new CountryService().country) ||
          loadedCountries[0];

        setCountry(countryOfResidence || loadedCountries[0]);

        const countryCode = (
          await axios.get('https://ipapi.co/json/', {
            cancelToken: source.token,
          })
        ).data?.country_code as string;

        new CountryService().initializeOrUpdate(countryCode);

        countryOfResidence =
          loadedCountries?.find(({ code }) => code === countryCode) || loadedCountries[0];

        if (countryOfResidence) {
          setCountry(countryOfResidence);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    })();

    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, []);

  return { countries, setCountry, country };
};
