import React, { useContext, useState, useCallback, useRef } from 'react';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';

import './login-page.scss';
import CountrySelect from '../../components/login-page/country-select/country-select';
import PhoneInput from '../../components/login-page/phone-input/phone-input';
import { history } from '../../../main';

import { country, countryList } from 'app/common/countries';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';
import { AuthActions } from 'app/store/auth/actions';
import { LocalizationContext } from 'app/app';

namespace LoginPageProps {
	export enum Stages {
		phoneInput = 1,
		codeInput,
		registration,
	}
}

const LoginPage = () => {
	const { t } = useContext(LocalizationContext);

	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
	const codeFromServer = useSelector<RootState, string>((rootState) => rootState.auth.confirmationCode);
	const isConfirmationCodeWrong = useSelector<RootState, boolean>(
		(rootState) => rootState.auth.isConfirmationCodeWrong,
	);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const checkConfirmationCode = useActionWithDeferred(AuthActions.confirmPhone);

	const boxesContainerRef = useRef<HTMLDivElement>(null);

	const [country, setCountry] = useState<country>(countryList[countryList.length - 1]);
	const [phone, setPhone] = useState<string>('');
	const [stage, setStage] = useState<LoginPageProps.Stages>(LoginPageProps.Stages.phoneInput);
	const [code, setCode] = useState<number[]>([]);
	const [error, setError] = useState<string>('');

	const sendSms = useCallback(async () => {
		const phoneNumber = parsePhoneNumberFromString(phone);

		if (phoneNumber?.isValid()) {
			setError('');

			await sendSmsCode<string>({ phoneNumber: phoneNumber?.number.toString() });

			setStage(2);
		} else {
			setError('Phone is not valid');
		}
	}, [setError, setStage, phone]);

	const checkCode = useCallback(async () => {
		await checkConfirmationCode({ code: code!.join(''), phoneNumber });
		history.push('/chats');
	}, [code, phone]);

	const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
		console.dir(event.target);

		//@ts-ignore
		const index = [...boxesContainerRef.current.children]!.indexOf(event.target);

		console.log(index);

		if (event.key === 'Backspace') {
			//@ts-ignore
			if (event.target.value === '') {
				//@ts-ignore
				if (event.target.previousSibling) {
					//@ts-ignore
					event.target.previousSibling.focus();
				}
			} else {
				//@ts-ignore
				event.target.value = '';
			}
		}

		if (
			event.key === '1' ||
			event.key === '2' ||
			event.key === '3' ||
			event.key === '4' ||
			event.key === '5' ||
			event.key === '6' ||
			event.key === '7' ||
			event.key === '8' ||
			event.key === '9' ||
			event.key === '0'
		) {
			setCode((oldCode) => {
				const copyCode: number[] = [...oldCode];
				copyCode[index] = Number(event.key);
				return copyCode;
			});

			//@ts-ignore
			event.target.value = event.key;
			event.preventDefault();
			//@ts-ignore
			if (event.target.nextSibling) {
				//@ts-ignore
				event.target.nextSibling.focus();
			} else {
				//@ts-ignore
				event.target.blur();
			}
		} else {
			event.preventDefault();
		}
	}, []);

	return (
		<div className='login-page'>
			{stage === LoginPageProps.Stages.phoneInput && (
				<div className='login-page__container'>
					<img src='' alt='' className='login-page__logo' />
					<p className='login-page__confirm-phone'>{t('loginPage.confirm_phone')}</p>
					{/* <p>+375445446331</p>
					<p>+375292725607</p>
					<p>+375445446388</p>
					<p>+375445446399</p> */}
					<div className='login-page__credentials'>
						<CountrySelect country={country} setCountry={setCountry} setPhone={setPhone} />
						<PhoneInput country={country} phone={phone} setPhone={setPhone} />
					</div>
					<button onClick={sendSms} className='login-page__button'>
						{t('loginPage.next')}
					</button>
					<p className='login-page__conditions'>
						{t('loginPage.agree_to')} <a href='#'>{t('loginPage.ravudi_terms')}</a>
					</p>
					{error && <p>{error}</p>}
					{codeFromServer && <p>Code: {codeFromServer}</p>}
				</div>
			)}
			{stage === LoginPageProps.Stages.codeInput && (
				<div className='login-page__container'>
					<p className='login-page__confirm-code'>{t('loginPage.confirm_code')}</p>
					<p className='login-page__code-sent'>{`${t('loginPage.code_sent_to')} ${new AsYouType().input(
						phoneNumber,
					)}`}</p>
					<div ref={boxesContainerRef} className='login-page__inputs-container'>
						<input onKeyDown={handleKeyPress} type='text' className='login-page__code-input' />
						<input onKeyDown={handleKeyPress} type='text' className='login-page__code-input' />
						<input onKeyDown={handleKeyPress} type='text' className='login-page__code-input' />
						<input onKeyDown={handleKeyPress} type='text' className='login-page__code-input' />
					</div>
					<p className='login-page__timer'>0:00</p>
					<button onClick={checkCode} className='login-page__button login-page__button--code-confirmation'>
						{t('loginPage.next')}
					</button>
					{isConfirmationCodeWrong && <p>{t('loginPage.wrong_code')}</p>}
				</div>
			)}
			{stage === LoginPageProps.Stages.registration && (
				<div className='login-page__container'>
					<h1>{t('loginPage.title')}</h1>
					<p>Please pass registration</p>
				</div>
			)}
		</div>
	);
};

export default React.memo(LoginPage);
