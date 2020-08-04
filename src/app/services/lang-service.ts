import { BrowserStorage } from 'app/utils/browser-storage';

export enum langs {
	en = 'en',
	ru = 'ru',
}

export interface languageI {
	language: langs;
}

export class LangService {
	private readonly language = 'language';
	private browserStorage = new BrowserStorage(this.language);

	public get currentLang(): languageI {
		return this.browserStorage.getObject<languageI>(this.language);
	}

	public setLang(lang: languageI) {
		this.browserStorage.setObject<languageI>(this.language, lang);
	}

	public clear() {
		this.browserStorage.clear();
	}
}
