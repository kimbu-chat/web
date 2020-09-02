import React, { useContext, useCallback, useEffect } from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { country, countryList } from '../../../common/countries';
import { LocalizationContext } from 'app/app';

namespace PhoneInput {
	export interface Props {
		country: country | null;
		setCountry: Function;
		phone: string;
		setPhone: Function;
	}
}

const PhoneInput = ({ phone, setPhone, setCountry }: PhoneInput.Props) => {
	const { t } = useContext(LocalizationContext);

	const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setPhone(e.target.value);
		const phoneNumber = parsePhoneNumberFromString(e.target.value);
		setCountry(() => {
			console.log(phoneNumber?.country || '');
			const result = countryList.find((elem) => elem.code === (phoneNumber?.country || ''));
			return result;
		});
	}, []);

	useEffect(() => {
		setPhone(new AsYouType().input(phone));
	}, [setPhone, phone]);

	return (
		<div className='phone-input'>
			<input
				placeholder={t('loginPage.phone')}
				value={phone}
				onChange={handlePhoneChange}
				className='phone-input__input'
			/>
		</div>
	);
};

export default PhoneInput;
