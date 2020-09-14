import React, { useCallback, useContext } from 'react';
import { AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { country } from '../../../common/countries';
import { LocalizationContext } from 'app/app';

namespace PhoneInput {
	export interface Props {
		country: country;
		phone: string;
		setPhone: Function;
	}
}

const PhoneInput = ({ country, phone, setPhone }: PhoneInput.Props) => {
	const { t } = useContext(LocalizationContext);

	const trimCountryCode = useCallback((countryCode: string, phone: string) => {
		let regex = '';
		const countryCodeArr = String(countryCode).split('');

		countryCodeArr.forEach((char) => {
			regex += `[${char}]\\s?`;
		});

		const replaceRegex = new RegExp(regex);

		return phone.replace(replaceRegex, '');
	}, []);

	const displayCountries = useCallback(() => {
		(document.querySelector('.country-select__input') as HTMLInputElement).focus();
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent('mousedown', true, true);
		(document.querySelector('.country-select__input') as HTMLInputElement).dispatchEvent(clickEvent);
	}, []);

	return (
		<div className='phone-input'>
			<input
				onClick={displayCountries}
				type='text'
				className='phone-input__country-code'
				readOnly
				value={country.number}
			/>
			<input
				placeholder={t('loginPage.phone')}
				value={trimCountryCode(country.number, new AsYouType().input(phone))}
				onChange={(e) => {
					setPhone(new AsYouType().input(country.number + e.target.value));
				}}
				className='phone-input__input'
			/>
		</div>
	);
};

export default PhoneInput;
