import { AxiosError } from 'axios';

export function isNetworkError(error: AxiosError): boolean {
  return error.response == null && error.message === 'Network Error';
}
