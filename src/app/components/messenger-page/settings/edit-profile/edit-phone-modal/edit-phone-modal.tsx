import { country, countryList } from 'app/common/countries';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import React, { useCallback, useRef, useState } from 'react';
import './edit-phone-modal.scss';
import ModalCountrySelect from './modal-country-select/modal-country-select';
import ModalPhoneInput from './modal-phone-input/modal-phone-input';

namespace EditPhoneModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const EditPhoneModal = ({ close, isDisplayed }: EditPhoneModal.Props) => {
	const [country, setCountry] = useState<country>(countryList[230]);
	const [phone, setPhone] = useState<string>('');

	const [countrySelectRef, setCountrySelectRef] = useState<React.RefObject<HTMLInputElement> | null>(null);
	const phoneInputRef = useRef<HTMLInputElement>(null);

	const sendSms = useCallback(() => {
		const phoneNumber = parsePhoneNumberFromString(phone);
		//!TODO: Replace here with send sms code logic
		console.log(phoneNumber);
	}, [phone]);

	const displayCountries = useCallback(() => {
		countrySelectRef?.current?.focus();
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent('mousedown', true, true);
		countrySelectRef?.current?.dispatchEvent(clickEvent);
	}, [countrySelectRef]);

	const focusPhoneInput = useCallback(() => {
		phoneInputRef.current?.focus();
	}, [phoneInputRef]);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={'Edit Phone Number'}
				closeModal={close}
				contents={
					<div className={'edit-phone-modal'}>
						<ModalCountrySelect
							setRef={setCountrySelectRef}
							country={country}
							setCountry={setCountry}
							setPhone={setPhone}
							focusPhoneInput={focusPhoneInput}
						/>
						<ModalPhoneInput
							ref={phoneInputRef}
							displayCountries={displayCountries}
							country={country}
							phone={phone}
							setPhone={setPhone}
							sendSms={sendSms}
						/>
					</div>
				}
				buttons={[
					{
						text: 'Save',
						style: {
							color: '#fff',
							backgroundColor: '#3F8AE0',
							padding: '11px 0px',
							border: '1px solid rgb(215, 216, 217)',
							width: '100%',
							marginBottom: '10px',
						},

						position: 'left',
						onClick: () => {},
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditPhoneModal;
