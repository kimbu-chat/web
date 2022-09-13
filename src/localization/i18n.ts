import dayjs from 'dayjs';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { SettingsService } from '@services/settings-service';

i18n.on('languageChanged', (language: string) => {
  if (language.includes('en')) {
    const lang = 'en';
    dayjs.locale(lang);
  } else {
    import(`dayjs/locale/${language}.js`).then(() => {
      dayjs.locale(language);
    });
  }
});

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: process.env.NODE_ENV !== 'production',
    initImmediate: false,
    lng: (new SettingsService().settings?.language || navigator.language)?.includes('ru')
      ? 'ru'
      : 'en',
    ns: 'translation',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/{{ns}}/{{lng}}.json',
    },
  })
  .then(() => {
    dayjs.locale(i18n.language);
  });

export default i18n;
