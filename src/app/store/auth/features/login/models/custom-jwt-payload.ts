import { JwtPayload } from 'jwt-decode';

export interface ICustomJwtPayload extends JwtPayload {
  profile: string;
}
