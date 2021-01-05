export interface IPage {
  limit: number;
  offset: number;
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

export enum CallStatus {
  Negotiating = 'Negotiating',
  Active = 'Active',
  Ended = 'Ended',
  Cancelled = 'Cancelled',
  Declined = 'Declined',
  NotAnswered = 'NotAnswered',
  Interrupted = 'Interrupted',
}
