import axios from 'axios';

import { ICountry } from '@common/country';

let loadedCountries: ICountry[];

export const getCountryList = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();

  const loadCountryList = async () => {
    if (!loadedCountries) {
      const loadedCountriesResponse = await axios.get(`/countries.json`, {
        cancelToken: source.token,
      });

      loadedCountries = loadedCountriesResponse.data;
    }

    return loadedCountries;
  };

  const cancelLoadCountryList = () => {
    source.cancel('Operation canceled by the user.');
  };

  return { loadCountryList, cancelLoadCountryList };
};
