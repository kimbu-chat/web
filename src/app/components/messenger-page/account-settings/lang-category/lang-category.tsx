import React, { useContext, useCallback } from 'react';
import { LocalizationContext } from 'app/app';
import { LangService, langs } from 'app/services/lang-service';

const LangCategory = () => {
	const { t, i18n } = useContext(LocalizationContext);
	const setEnLang = useCallback(() => {
		i18n?.changeLanguage('en');
		new LangService().setLang({ language: langs.en });
	}, []);

	const setRuLang = useCallback(() => {
		i18n?.changeLanguage('ru');
		new LangService().setLang({ language: langs.ru });
	}, []);

	return (
		<div className='account-settings__language'>
			<h2>{t('langCategory.language')}</h2>
			<div className='account-settings__select-block'>
				<div className='account-settings__select-block__option'>
					<input
						onClick={setRuLang}
						id='russian'
						type='radio'
						className='account-settings__radio'
						name='lang'
					/>
					<label className='box' htmlFor='russian'></label>
					<label htmlFor='russian'>Русский</label>
				</div>
				<div className='account-settings__select-block__option'>
					<input
						onClick={setEnLang}
						id='english'
						type='radio'
						className='account-settings__radio'
						name='lang'
					/>
					<label className='box' htmlFor='english'></label>
					<label htmlFor='english'>English</label>
				</div>
			</div>
		</div>
	);
};

export default React.memo(LangCategory);
