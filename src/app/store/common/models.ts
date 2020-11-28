export interface Page {
  limit: number;
  offset: number;
}

export interface UpdateAvatarResponse {
  fullAvatarUrl: string;
  croppedAvatarUrl: string;
}

export enum UserStatus {
  Offline = 'Offline',
  Away = 'Away',
  Online = 'Online',
}
