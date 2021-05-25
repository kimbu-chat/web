import { JwtPayload } from 'jwt-decode';

export interface ICustomJwtPayload extends JwtPayload {
  refreshTokenId: string;
}
