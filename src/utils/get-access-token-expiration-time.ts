import jwtDecode, { JwtPayload } from "jwt-decode";

export const getAccessTokenExpirationTime = (accessToken: string): Date => {

    const decodedJwt = jwtDecode<JwtPayload>(accessToken);

    if(!decodedJwt?.exp) {
        throw new Error('Missing exp claim');
    }

    return new Date(decodedJwt?.exp * 1000);
}