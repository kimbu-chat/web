import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RadioBox } from '@components/radio-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as RussiaSvg } from '@icons/Russian.svg';
import { ReactComponent as USASvg } from '@icons/Usa.svg';
import { changeLanguageAction } from '@store/settings/actions';
import { Langs } from '@store/settings/features/models';
import { getCurrentLanguageSelector } from '@store/settings/selectors';

import './language-settings.scss';

const LanguageSettings = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = useSelector(getCurrentLanguageSelector);

  const changeLanguage = useActionWithDispatch(changeLanguageAction);
  const setEnLang = useCallback(() => {
    if (currentLanguage !== Langs.En) {
      i18n?.changeLanguage(Langs.En);
      changeLanguage({ language: Langs.En });
    }
  }, [changeLanguage, currentLanguage, i18n]);

  const setRuLang = useCallback(() => {
    if (currentLanguage !== Langs.Ru) {
      i18n?.changeLanguage(Langs.Ru);
      changeLanguage({ language: Langs.Ru });
    }
  }, [changeLanguage, currentLanguage, i18n]);

  return (
    <div className="language-settings">
      <h3 className="language-settings__title">{t('languageSettings.title')}</h3>
      <form>
        <div
          onClick={setEnLang}
          className={`language-settings__language ${
            currentLanguage === Langs.En ? 'language-settings__language--active' : ''
          }`}>
          <RadioBox
            defaultChecked={currentLanguage === Langs.En}
            groupName="language"
            content={
              <>
                <USASvg className="language-settings__icon" />
                <span className="language-settings__language-name">English</span>
                <span className="language-settings__language-country">
                  {t('languageSettings.usa-uk')}
                </span>
              </>
            }
          />
        </div>

        <div
          onClick={setRuLang}
          className={`language-settings__language ${
            currentLanguage === Langs.Ru ? 'language-settings__language--active' : ''
          }`}>
          <RadioBox
            defaultChecked={currentLanguage === Langs.Ru}
            groupName="language"
            content={
              <>
                <RussiaSvg className="language-settings__icon" />
                <span className="language-settings__language-name">Русский</span>
                <span className="language-settings__language-country">
                  {t('languageSettings.russia')}
                </span>
              </>
            }
          />
        </div>
      </form>
    </div>
  );
};

LanguageSettings.displayName = 'LanguageSettings';

export default LanguageSettings;
