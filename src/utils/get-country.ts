import axios from 'axios';

import { CountryService } from '@services/country-service';

export const getCountry = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();

  const loadCountry = async () => {
    const countryCode = (
      await axios.get('https://ipapi.co/json/', {
        cancelToken: source.token,
      })
    ).data?.country_code as string;

    new CountryService().initializeOrUpdate(countryCode);

    return countryCode;
  };

  const cancelLoadCountry = () => {
    source.cancel('Operation canceled by the user.');
  };

  return { loadCountry, cancelLoadCountry };
};
