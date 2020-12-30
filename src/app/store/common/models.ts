export interface IPage {
  limit: number;
  offset: number;
}

export interface IUpdateAvatarResponse {
  fullAvatarUrl: string;
  croppedAvatarUrl: string;
}

export enum UserStatus {
  Offline = 'Offline',
  Away = 'Away',
  Online = 'Online',
}

export enum HttpRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}
