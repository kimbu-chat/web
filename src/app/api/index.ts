import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { LoginApiResponse } from 'app/store/auth/types';
import { AuthService } from 'app/services/auth-service';

export const ENDPOINTS = {
  LOGIN: '/api/users/login',
  REFRESH_TOKEN: '/api/users/refresh',
  REGISTER: '/api/users',
  UPDATE_MY_PROFILE: '/api/users',
  GET_USER_PROFILE: '/api/users',
  CHECK_NICKNAME_AVAILABILITY: '/api/is-nick-name-available',
  SEND_SMS_CONFIRMATION_CODE: '/api/users/send-sms-confirmation-code',
  GET_DIALOGS: '/api/dialogsConferences',
  REMOVE_DIALOG: '/api/dialogsConferences/changeHiddenStatus',
  MUTE_DIALOG: '/api/dialogsConferences/changeMutedStatus',
  CONFIRM_PHONE: '/api/users/verify-sms-code',
  GET_MESSAGES: '/api/messages/search',
  GET_NEWS: '/api/news/userNews',
  CREATE_MESSAGE: '/api/messages',
  CHANGE_ONLINE_STATUS: '/api/users/changeOnlineStatus',
  GET_CONTACTS: '/api/contacts/search',
  DELETE_CONTACT: '/api/contacts',
  LEAVE_CONFERENCE: '/api/conferences',
  CREATE_CONFERENCE: '/api/conferences',
  MARK_MESSAGES_AS_READ: '/api/dialogsConferences/markAsRead',
  NOTIFICATIONS_SUBSCRIBE: '/api/notifications/subscribe',
  UPDATE_CONTACTS: '/api/contacts',
  MESSAGE_TYPING: '/api/message/notify-interlocutor-about-message-typing',
  GET_CONFERENCE_USERS: 'api/conferences/members',
  ADD_USERS_TO_CONFERENCE: '/api/conferences/users',
  RENAME_CONFERENCE: '/api/conference'
};

const authService = new AuthService();

const mainApiInstance = axios.create({
  baseURL: 'http://api.ravudi.com',
  headers: {
    Authorization: `Bearer ${authService?.auth?.accessToken}`
  }
});

const notificationsInstance = axios.create({
  baseURL: 'http://notifications.ravudi.com'
});

export const setToken = (token: string): void => {
  mainApiInstance.defaults.headers.Authorization = `Bearer ${token}`;
  notificationsInstance.defaults.headers.Authorization = `Bearer ${token}`;
};

function assignResponseInterceptor(service: AxiosInstance): void {
  service.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401) {
        // todo: fetch frol local storage refresh token token and send it to get new access token
        // const { refreshToken } = UserRepository.getUserAuthData();
        return (
          api
            // .post<LoginApiResponse>(ENDPOINTS.REFRESH_TOKEN, { refreshToken })
            .post<LoginApiResponse>(ENDPOINTS.REFRESH_TOKEN, { refreshToken: '' })
            .then((res: AxiosResponse<LoginApiResponse>) => {
              // save new access and refresh tokens into local storage
              //setTokenAndSaveLoginResponse(res.data);
              error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
              return axios.request(error.config);
            })
            .catch(() => {
              alert('api error');
            })
        );
      }
      return error;
    }
  );
}

type api = {
  put<T = any>(url: string, data: object): AxiosPromise<T>;
  post<T = any>(url: string, data: object): AxiosPromise<T>;
  get<T = any>(url: string, data?: object, config?: object): AxiosPromise<T>;
  delete(url: string): AxiosPromise;
};

function createApi(service: AxiosInstance): api {
  assignResponseInterceptor(service);
  return {
    put: (url: string, data: object) => service.put(url, data),
    post: (url: string, data: object) => service.post(url, data),
    get: (url: string, data: object, config?: object) => service.get(url, { params: data, ...config }),
    delete: (url: string) => service.delete(url)
  };
}

export const api: api = createApi(mainApiInstance);
export const notifications = createApi(notificationsInstance);
