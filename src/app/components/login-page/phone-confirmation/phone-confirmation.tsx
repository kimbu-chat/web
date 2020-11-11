import React, { useCallback, useContext, useState, useRef, useEffect, lazy, Suspense } from 'react';
import './phone-confirmation.scss';
import CountrySelect from './components/country-select/country-select';
import PhoneInput from './components/phone-input/phone-input';
import { Country, countryList } from 'app/common/countries';
import { LocalizationContext } from 'app/app';
import { useActionWithDeferred } from 'app/utils/hooks/use-action-with-deferred';
import { AuthActions } from 'app/store/auth/actions';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';
import { useHistory } from 'react-router';
import BaseBtn from 'app/components/shared/base-btn/base-btn';
import { getCountryByIp } from 'app/utils/functions/get-country-by-ip';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import WithBackground from 'app/components/shared/with-background';
import CubeLoader from 'app/containers/cube-loader/cube-loader';

const PrivacyPolicy = lazy(() => import('app/components/shared/privacy-policy/privacy-policy'));

namespace PhoneConfirmation {
	export interface Props {
		preloadNext: () => void;
	}
}

const PhoneConfirmation: React.FC<PhoneConfirmation.Props> = ({ preloadNext }) => {
	const { t } = useContext(LocalizationContext);

	const history = useHistory();

	const isLoading = useSelector((state: RootState) => state.auth.loading);

	const [country, setCountry] = useState<Country>(countryList[countryList.length - 1]);
	const [phone, setPhone] = useState<string>('');
	const [countrySelectRef, setCountrySelectRef] = useState<React.RefObject<HTMLInputElement> | null>(null);
	const [policyDisplayed, setPolicyDisplayed] = useState(false);

	const phoneInputRef = useRef<HTMLInputElement>(null);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const sendSms = useCallback(() => {
		const phoneNumber = parsePhoneNumberFromString(phone);
		if (phoneNumber?.isValid) {
			sendSmsCode({ phoneNumber: phoneNumber!.number as string })
				.then(() => {
					history.push('/confirm-code');
				})
				.catch(() => {
					alert('sms limit');
				});
		}
	}, [phone]);

	const changePolicyDisplayedState = useCallback(() => {
		setPolicyDisplayed((oldState) => !oldState);
	}, [setPolicyDisplayed]);

	const displayCountries = useCallback(() => {
		countrySelectRef?.current?.focus();
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent('mousedown', true, true);
		countrySelectRef?.current?.dispatchEvent(clickEvent);
	}, [countrySelectRef]);

	const focusPhoneInput = useCallback(() => {
		phoneInputRef.current?.focus();
	}, [phoneInputRef]);

	const handleCountryChange = useCallback(
		(newCountry: Country) => {
			setCountry((oldCountry) => {
				setPhone((oldPhone) => {
					focusPhoneInput();
					if (oldCountry.title.length > 0) {
						const onlyNumber = oldPhone.split(' ').join('').split(oldCountry.number)[1];
						const newCode = newCountry ? newCountry.number : '';
						return onlyNumber ? newCode + onlyNumber : newCode;
					} else {
						return newCountry ? newCountry.number + oldPhone : '';
					}
				});
				return newCountry ? newCountry : oldCountry;
			});
		},
		[setCountry, setPhone, focusPhoneInput],
	);

	useEffect(() => {
		preloadNext();
		setCountry(countryList[0]);
		(async () => {
			const countryCode = await getCountryByIp();
			const country = countryList.find(({ code }) => code === countryCode) || countryList[0];
			setCountry(country);
		})();
	}, []);

	//!Temporal code
	//TODO:Remove im production
	const [areNumbersDisplayed, setNumbersDisplayed] = useState(false);
	const changeNumbersDisplayedState = useCallback(() => {
		setNumbersDisplayed((oldState) => !oldState);
	}, [setNumbersDisplayed]);

	return (
		<>
			<div className='phone-confirmation'>
				<div className='phone-confirmation__container'>
					<h1 className='phone-confirmation__logo'>KIMBU</h1>
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
							handleCountryChange={handleCountryChange}
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
					<BaseBtn
						disabled={isLoading}
						isLoading={isLoading}
						onClick={sendSms}
						variant={'contained'}
						color={'primary'}
						width={'contained'}
						className='phone-confirmation__btn'
					>
						{t('loginPage.next')}
					</BaseBtn>
					<p className='phone-confirmation__conditions'>
						{t('loginPage.agree_to')}{' '}
						<span onClick={changePolicyDisplayedState}>{t('loginPage.ravudi_terms')}</span>
					</p>
				</div>
			</div>
			<FadeAnimationWrapper isDisplayed={policyDisplayed}>
				<WithBackground onBackgroundClick={changePolicyDisplayedState}>
					<Suspense fallback={<CubeLoader />}>
						<PrivacyPolicy close={changePolicyDisplayedState} />
					</Suspense>
				</WithBackground>
			</FadeAnimationWrapper>
		</>
	);
};

export default PhoneConfirmation;
