import React, { useContext, useCallback } from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import TextField from '@material-ui/core/TextField';

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
		setPhone(new AsYouType().input(e.target.value));
		const phoneNumber = parsePhoneNumberFromString(e.target.value);
		setCountry((oldCountry: country | null) => {
			const result = countryList.find((elem) => elem.code === phoneNumber?.country);
			return result ? result : oldCountry;
		});
	}, []);

	return (
		<div className='phone-input'>
			<TextField
				value={phone}
				onChange={handlePhoneChange}
				className='phone-input__input'
				id='outlined-required'
				label={t('loginPage.phone')}
				variant='outlined'
			/>
		</div>
	);
};

export default PhoneInput;
