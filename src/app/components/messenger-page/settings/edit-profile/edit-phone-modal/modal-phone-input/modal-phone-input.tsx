import React, { useCallback, useContext } from 'react';
import './modal-phone-input.scss';
import { country } from 'app/common/countries';
import { AsYouType } from 'libphonenumber-js';
import { LocalizationContext } from 'app/app';

namespace ModalPhoneInput {
	export interface Props {
		country: country;
		phone: string;
		setPhone: Function;
		displayCountries: () => void;
		sendSms: () => void;
	}
}

const ModalPhoneInput = React.forwardRef(
	(
		{ country, phone, setPhone, displayCountries, sendSms }: ModalPhoneInput.Props,
		ref: React.Ref<HTMLInputElement>,
	) => {
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
			<div className='modal-phone-input'>
				<div className='modal-phone-input__label'>{t('editPhoneModal.phone_number')}</div>
				<div className='modal-phone-input__inputs-wrapper'>
					<input
						onClick={displayCountries}
						type='text'
						className='modal-phone-input__country-code'
						readOnly
						value={country.number}
					/>
					<input
						ref={ref}
						placeholder={'234-56-789'}
						value={trimCountryCode(country.number, new AsYouType().input(phone))}
						onChange={(e) => {
							setPhone(new AsYouType().input(country.number + e.target.value));
						}}
						className='modal-phone-input__input'
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && sendSms()}
					/>
				</div>
			</div>
		);
	},
);

export default ModalPhoneInput;
