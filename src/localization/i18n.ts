import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import { SettingsService } from '@services/settings-service';
import HttpApi from 'i18next-http-backend';
import 'moment/locale/ru';

// todo: load only needed local at runtime

i18n.on('languageChanged', (lng: string) => {
  moment.locale(lng);
});

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: process.env.NODE_ENV !== 'production',
    initImmediate: false,
    lng: new SettingsService().settings?.language || navigator.language,
    ns: 'translation',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/{{ns}}/{{lng}}.json',
    },
  })
  .then(() => {
    moment.locale(i18n.language);
  });

export default i18n;
