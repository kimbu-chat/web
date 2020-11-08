import { LocalizationContext } from 'app/app';
import { Country, countryList } from 'app/common/countries';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import { parsePhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-phone-modal.scss';
import ModalCountrySelect from './modal-country-select/modal-country-select';
import ModalPhoneInput from './modal-phone-input/modal-phone-input';

namespace EditPhoneModal {
	export interface Props {
		onClose: () => void;
	}
}

const EditPhoneModal = ({ onClose }: EditPhoneModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const currentNumber = useSelector((state: RootState) => state.myProfile.user?.phoneNumber);
	const currentNumberCountry = parsePhoneNumber(currentNumber!).country;

	const [country, setCountry] = useState<Country>(countryList.find(({ code }) => currentNumberCountry === code)!);
	const [phone, setPhone] = useState<string>('');
	const [countrySelectRef, setCountrySelectRef] = useState<React.RefObject<HTMLInputElement> | null>(null);

	const phoneInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setCountry(countryList.find(({ code }) => currentNumberCountry === code)!);
	}, []);

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
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title={t('editPhoneModal.edit_phone')}
				closeModal={onClose}
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
						children: 'Save',
						style: {
							marginBottom: '10px',
						},
						onClick: () => {},
						position: 'left',
						width: 'contained',
						variant: 'contained',
						color: 'primary',
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditPhoneModal;
