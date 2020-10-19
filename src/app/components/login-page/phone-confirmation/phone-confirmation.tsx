import React, { useCallback, useContext, useState, useRef, useEffect } from 'react';
import './phone-confirmation.scss';
import CountrySelect from './components/country-select/country-select';
import PhoneInput from './components/phone-input/phone-input';
import { country, countryList } from 'app/common/countries';
import { LocalizationContext } from 'app/app';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { AuthActions } from 'app/store/auth/actions';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';
import { useHistory } from 'react-router';

const PhoneConfirmation = () => {
	const { t } = useContext(LocalizationContext);

	const history = useHistory();

	const isLoading = useSelector((state: RootState) => state.auth.loading);

	const [country, setCountry] = useState<country>(countryList[countryList.length - 1]);
	const [phone, setPhone] = useState<string>('');

	const [countrySelectRef, setCountrySelectRef] = useState<React.RefObject<HTMLInputElement> | null>(null);
	const phoneInputRef = useRef<HTMLInputElement>(null);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const sendSms = useCallback(() => {
		const phoneNumber = parsePhoneNumberFromString(phone);
		if (phoneNumber?.isValid) {
			sendSmsCode({ phoneNumber: phoneNumber!.number as string }).then(() => {
				history.push('/confirm-code');
			});
		}
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

	useEffect(() => {
		setCountry(countryList[0]);
		(async () => {
			const result = await fetch('https://ipapi.co/json/');

			if (result.ok) {
				const countryData = await result.json();

				const country =
					countryList.find(({ code }) => countryData.country_code === code) ||
					countryList[countryList.length - 1];
				setCountry(country);
			}
		})();
	}, []);

	//!Temporal code
	//TODO:Remove im production
	const [areNumbersDisplayed, setNumbersDisplayed] = useState(false);
	const changeNumbersDisplayedState = useCallback(() => {
		setNumbersDisplayed((oldState) => !oldState);
	}, [setNumbersDisplayed]);

	return (
		<div className='phone-confirmation'>
			<div className='phone-confirmation__container'>
				<img src='' alt='' className='phone-confirmation__logo' />
				<p onClick={changeNumbersDisplayedState} className='phone-confirmation__confirm-phone'>
					{t('loginPage.confirm_phone')}
				</p>
				{areNumbersDisplayed && (
					<>
						<p>+375445446331</p>
						<p>+375292725607</p>
						<p>+375445446388</p>
						<p>+375445446399</p>
					</>
				)}
				<div className='phone-confirmation__credentials'>
					<CountrySelect
						setRef={setCountrySelectRef}
						country={country}
						setCountry={setCountry}
						setPhone={setPhone}
						focusPhoneInput={focusPhoneInput}
					/>
					<PhoneInput
						ref={phoneInputRef}
						displayCountries={displayCountries}
						country={country}
						phone={phone}
						setPhone={setPhone}
						sendSms={sendSms}
					/>
				</div>
				<button disabled={isLoading} onClick={sendSms} className='phone-confirmation__button'>
					{t('loginPage.next')}
				</button>
				<p className='phone-confirmation__conditions'>
					{t('loginPage.agree_to')} <a href='#'>{t('loginPage.ravudi_terms')}</a>
				</p>
			</div>
		</div>
	);
};

export default PhoneConfirmation;
