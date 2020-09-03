import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';

// todo: load only needed local at runtime
import 'moment/min/locales';
import { LangService } from 'app/services/lang-service';

i18n.use(initReactI18next).init({
	debug: process.env.NODE_ENV !== 'production',
	initImmediate: false,
	preload: ['en'],
	fallbackLng: 'en',
	lng: new LangService()?.currentLang?.language || navigator.language,
	resources: {
		en: {
			translation: en,
		},
		ru: {
			translation: ru,
		},
	},
	ns: ['translation'],
	defaultNS: 'translation',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
