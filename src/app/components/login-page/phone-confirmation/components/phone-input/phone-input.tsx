import React, { useCallback, useContext } from 'react';
import { AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { country } from 'app/common/countries';
import { LocalizationContext } from 'app/app';

namespace PhoneInput {
	export interface Props {
		country: country;
		phone: string;
		setPhone: Function;
		displayCountries: () => void;
	}
}

const PhoneInput = React.forwardRef(
	({ country, phone, setPhone, displayCountries }: PhoneInput.Props, ref: React.Ref<HTMLInputElement>) => {
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
					ref={ref}
					placeholder={t('loginPage.phone')}
					value={trimCountryCode(country.number, new AsYouType().input(phone))}
					onChange={(e) => {
						setPhone(new AsYouType().input(country.number + e.target.value));
					}}
					className='phone-input__input'
				/>
			</div>
		);
	},
);

export default PhoneInput;
