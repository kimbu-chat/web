import React, { useContext, useState, useCallback } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import './LoginPage.scss';
import CountrySelect from '../../components/LoginPage/CountrySelect/CountrySelect';
import PhoneInput from '../../components/LoginPage/PhoneInput/PhoneInput';
import { history } from '../../../main';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { country } from 'app/utils/countries';
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

	const [country, setCountry] = useState<null | country>(null);
	const [phone, setPhone] = useState<string>('');
	const [stage, setStage] = useState<LoginPageProps.Stages>(LoginPageProps.Stages.phoneInput);
	const [code, setCode] = useState('');
	const [error, setError] = useState<string>('');

	const codeFromServer = useSelector<RootState, string>((rootState) => rootState.auth.confirmationCode);
	const isConfirmationCodeWrong = useSelector<RootState, boolean>(
		(rootState) => rootState.auth.isConfirmationCodeWrong,
	);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const checkConfirmationCode = useActionWithDeferred(AuthActions.confirmPhone);

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
		await checkConfirmationCode({ code, phoneNumber: parsePhoneNumberFromString(phone)?.number?.toString() || '' });
		history.push('/chats');
	}, [code, phone]);

	const confirmPhoneByCode = useCallback(
		(event: any) => {
			if (event.key === 'Enter') {
				checkCode();
			}
		},
		[checkCode],
	);

	return (
		<div className='login-page'>
			{stage === LoginPageProps.Stages.phoneInput && (
				<div className='login-page__container'>
					<img src='' alt='' className='login-page__logo' />
					<h1>{t('loginPage.title')}</h1>
					<p>{t('loginPage.confirm_phone')}</p>
					<CountrySelect country={country} setCountry={setCountry} setPhone={setPhone} />
					<PhoneInput phone={phone} setPhone={setPhone} country={country} setCountry={setCountry} />
					<div className='login-page__button-container'>
						<Button onClick={sendSms} className='login-page__button' variant='contained' color='primary'>
							{t('loginPage.next')}
						</Button>
					</div>
					{error && <p>{error}</p>}
				</div>
			)}
			{stage === LoginPageProps.Stages.codeInput && (
				<div className='login-page__container'>
					{codeFromServer && <p>Code: {codeFromServer}</p>}
					<h1>{t('loginPage.title')}</h1>
					<p>{t('loginPage.confirm_code')}</p>
					<div className='login-page__code-input'>
						<TextField
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className='phone-input__input'
							id='outlined-required'
							label={t('loginPage.code')}
							variant='outlined'
							onKeyPress={confirmPhoneByCode}
						/>
						<div className='login-page__button-container'>
							<Button
								onClick={checkCode}
								className='login-page__check-button'
								variant='contained'
								color='primary'
							>
								{t('loginPage.log_in')}
							</Button>
						</div>
					</div>
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
