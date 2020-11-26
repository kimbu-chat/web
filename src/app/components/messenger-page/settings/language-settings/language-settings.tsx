import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'store/settings/actions';
import { langs } from 'store/settings/models';
import { getCurrentLanguage } from 'store/settings/selectors';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RadioBox } from '../shared/radio-box/radio-box';
import './language-settings.scss';

export const LanguageSettings = React.memo(() => {
	const { i18n } = useContext(LocalizationContext);

	const currentLanguage = useSelector(getCurrentLanguage);

	const changeLanguage = useActionWithDispatch(SettingsActions.changeLanguageAction);
	const setEnLang = useCallback(() => {
		i18n?.changeLanguage(langs.en);
		changeLanguage({ language: langs.en });
	}, []);

	const setRuLang = useCallback(() => {
		i18n?.changeLanguage(langs.ru);
		changeLanguage({ language: langs.ru });
	}, []);

	return (
		<div className='language-settings'>
			<form>
				<RadioBox
					defaultChecked={currentLanguage === langs.en}
					groupName='language'
					nestingLevel={0}
					onClick={setEnLang}
					title={'English'}
				/>
				<RadioBox
					defaultChecked={currentLanguage === langs.ru}
					groupName='language'
					nestingLevel={0}
					onClick={setRuLang}
					title={'Русский'}
				/>
			</form>
		</div>
	);
});
