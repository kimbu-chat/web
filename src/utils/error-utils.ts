import { AxiosError } from 'axios';
import {ApplicationErrorCode, IApplicationError} from "kimbu-models";

export function isNetworkError(error: AxiosError): boolean {
  return error.response == null && error.message === 'Network Error';
}

export const mapAxiosErrorToApplicationError = (error: AxiosError): ApplicationErrorCode => {
  const { response } = error;
  const errorData = response?.data as IApplicationError;
  if(!errorData){
    return ApplicationErrorCode.InternalServerError;
  }
  return errorData.code;
};
