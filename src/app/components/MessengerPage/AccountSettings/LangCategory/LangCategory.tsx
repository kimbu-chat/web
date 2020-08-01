import React, { useContext } from 'react';
import { LocalizationContext } from 'app/app';

const LangCategory = () => {
	const { t, i18n } = useContext(LocalizationContext);
	return (
		<div className='account-settings__language'>
			<h2>{t('langCategory.language')}</h2>
			<div className='account-settings__select-block'>
				<div className='account-settings__select-block__option'>
					<input
						onClick={() => {
							i18n.changeLanguage('ru');
							console.log(7);
						}}
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
						onClick={() => {
							i18n.changeLanguage('en');
						}}
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

export default LangCategory;
