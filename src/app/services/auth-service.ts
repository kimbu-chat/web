import { BrowserStorage } from 'app/utils/functions/browser-storage';
import { SecurityTokens } from 'app/store/auth/models';

export class AuthService {
	private readonly authentication = 'authentication';
	private browserStorage = new BrowserStorage(this.authentication);

	public get securityTokens(): SecurityTokens {
		return this.browserStorage.getObject<SecurityTokens>(this.authentication);
	}

	public initialize(auth: SecurityTokens) {
		this.browserStorage.setObject<SecurityTokens>(this.authentication, auth);
	}

	public clear() {
		this.browserStorage.clear();
	}
}
