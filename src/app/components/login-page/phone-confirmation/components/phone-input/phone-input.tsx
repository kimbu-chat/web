import React, { useContext } from 'react';
import { AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { Country } from 'app/common/countries';
import { LocalizationContext } from 'app/app';
import { removeCountryCodeFromPhoneNumber } from 'utils/functions/phone-number-utils';

namespace PhoneInput {
	export interface Props {
		country: Country;
		phone: string;
		setPhone: Function;
		displayCountries: () => void;
		sendSms: () => void;
	}
}

export const PhoneInput = React.forwardRef(
	({ country, phone, setPhone, displayCountries, sendSms }: PhoneInput.Props, ref: React.Ref<HTMLInputElement>) => {
		const { t } = useContext(LocalizationContext);

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
					value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(phone))}
					onChange={(e) => {
						setPhone(new AsYouType().input(country.number + e.target.value));
					}}
					className='phone-input__input'
					onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && sendSms()}
				/>
			</div>
		);
	},
);
