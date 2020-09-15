import React, { useCallback, useContext, useState } from 'react';
import './phone-confirmation.scss';
import CountrySelect from './components/country-select/country-select';
import PhoneInput from './components/phone-input/phone-input';
import { country, countryList } from 'app/common/countries';
import { LocalizationContext } from 'app/app';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { AuthActions } from 'app/store/auth/actions';
import { history } from '../../../../main';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const PhoneConfirmation = () => {
	const { t } = useContext(LocalizationContext);

	const [country, setCountry] = useState<country>(countryList[countryList.length - 1]);
	const [phone, setPhone] = useState<string>('');

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const sendSms = useCallback(() => {
		const phoneNumber = parsePhoneNumberFromString(phone);
		if (phoneNumber?.isValid) {
			sendSmsCode({ phoneNumber: phoneNumber!.number as string }).then(() => {
				history.push('/confirm-code');
			});
		}
	}, [phone]);

	return (
		<div className='phone-confirmation'>
			<div className='phone-confirmation__container'>
				<img src='' alt='' className='phone-confirmation__logo' />
				<p className='phone-confirmation__confirm-phone'>{t('loginPage.confirm_phone')}</p>
				{/* <p>+375445446331</p>
					<p>+375292725607</p>
					<p>+375445446388</p>
					<p>+375445446399</p> */}
				<div className='phone-confirmation__credentials'>
					<CountrySelect country={country} setCountry={setCountry} setPhone={setPhone} />
					<PhoneInput country={country} phone={phone} setPhone={setPhone} />
				</div>
				<button onClick={sendSms} className='phone-confirmation__button'>
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
