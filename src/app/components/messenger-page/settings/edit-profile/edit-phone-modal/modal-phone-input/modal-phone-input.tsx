import React, { useContext } from 'react';
import './modal-phone-input.scss';
import { Country } from 'app/common/countries';
import { AsYouType } from 'libphonenumber-js';
import { LocalizationContext } from 'app/app';
import { removeCountryCodeFromPhoneNumber } from 'app/utils/functions/phone-number-utils';

namespace ModalPhoneInput {
	export interface Props {
		country: Country;
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
						value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(phone))}
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
