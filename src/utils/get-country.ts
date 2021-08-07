import axios, { AxiosRequestConfig } from 'axios';

import { CountryService } from '@services/country-service';
import { HttpRequestMethod } from '@store/common/http';

export const getCountry = () => {
  const { CancelToken } = axios;
  const source = CancelToken.source();

  const requestConfig: AxiosRequestConfig = {
    url: 'https://ipapi.co/json/',
    method: HttpRequestMethod.Get,
    timeout: 1000,
    cancelToken: source.token,
    responseType: 'json',
  };

  const loadCountry = async () => {
    const countryCode = (await axios.get('https://ipapi.co/json/', requestConfig)).data
      ?.country_code as string;

    new CountryService().initializeOrUpdate(countryCode);

    return countryCode;
  };

  const cancelLoadCountry = () => {
    source.cancel('Operation canceled by the user.');
  };

  return { loadCountry, cancelLoadCountry };
};
