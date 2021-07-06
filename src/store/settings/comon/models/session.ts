export interface ISession {
  id: number;
  ipAddress: string;
  signedInDateTime: string;
  lastAccessedDateTime: string;
  os: string;
  clientApp: string;
}
