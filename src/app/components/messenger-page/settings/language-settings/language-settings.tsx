import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'store/settings/actions';
import { Langs } from 'store/settings/models';
import { getCurrentLanguage } from 'store/settings/selectors';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RadioBox } from '../shared/radio-box/radio-box';
import './language-settings.scss';

export const LanguageSettings = React.memo(() => {
  const { i18n } = useContext(LocalizationContext);

  const currentLanguage = useSelector(getCurrentLanguage);

  const changeLanguage = useActionWithDispatch(SettingsActions.changeLanguageAction);
  const setEnLang = useCallback(() => {
    i18n?.changeLanguage(Langs.En);
    changeLanguage({ language: Langs.En });
  }, []);

  const setRuLang = useCallback(() => {
    i18n?.changeLanguage(Langs.Ru);
    changeLanguage({ language: Langs.Ru });
  }, []);

  return (
    <div className='language-settings'>
      <form>
        <RadioBox defaultChecked={currentLanguage === Langs.En} groupName='language' nestingLevel={0} onClick={setEnLang} title='English' />
        <RadioBox defaultChecked={currentLanguage === Langs.Ru} groupName='language' nestingLevel={0} onClick={setRuLang} title='Русский' />
      </form>
    </div>
  );
});
