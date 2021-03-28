import { LocalizationContext } from '@contexts';
import * as SettingsActions from '@store/settings/actions';
import { getCurrentLanguageSelector } from '@store/settings/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Langs } from '@store/settings/features/models';
import RussiaSvg from '@icons/Russia.svg';
import USASvg from '@icons/Usa.svg';
import { RadioBox } from '../shared/radio-box/radio-box';
import './language-settings.scss';

export const LanguageSettings = React.memo(() => {
  const { i18n, t } = useContext(LocalizationContext);

  const currentLanguage = useSelector(getCurrentLanguageSelector);

  const changeLanguage = useActionWithDispatch(SettingsActions.changeLanguageAction);
  const setEnLang = useCallback(() => {
    i18n?.changeLanguage(Langs.En);
    changeLanguage({ language: Langs.En });
  }, [changeLanguage, i18n]);

  const setRuLang = useCallback(() => {
    i18n?.changeLanguage(Langs.Ru);
    changeLanguage({ language: Langs.Ru });
  }, [changeLanguage, i18n]);

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
            onClick={setEnLang}
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
          className={`language-settings__language ${
            currentLanguage === Langs.Ru ? 'language-settings__language--active' : ''
          }`}>
          <RadioBox
            defaultChecked={currentLanguage === Langs.Ru}
            groupName="language"
            onClick={setRuLang}
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
});
