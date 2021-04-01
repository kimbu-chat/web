export interface ISession {
  id: number;
  ipAddress: string;
  signedInDateTime: Date;
  lastAccessedDateTime: Date;
  os: string;
  clientApp: string;
}
