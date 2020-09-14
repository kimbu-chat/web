import React, { useContext, useState, useCallback, useRef } from 'react';
import { AsYouType } from 'libphonenumber-js';

import './login-page.scss';
import CountrySelect from '../../components/login-page/country-select/country-select';
import PhoneInput from '../../components/login-page/phone-input/phone-input';
import { history } from '../../../main';

import useInterval from 'use-interval';

import { country, countryList } from 'app/common/countries';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';
import { AuthActions } from 'app/store/auth/actions';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

// import ResendIcon from 'app/assets/icons/ic-search.svg';

namespace LoginPageProps {
	export enum Stages {
		phoneInput = 1,
		codeInput,
		registration,
	}
}

const NUMBER_OF_DIGITS = [0, 1, 2, 3];

const LoginPage = () => {
	const { t } = useContext(LocalizationContext);

	const checkIfCharacterIsNumeric = (character: string): boolean => /^[0-9]+$/.test(character);

	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
	const codeFromServer = useSelector<RootState, string>((rootState) => rootState.auth.confirmationCode);
	const isConfirmationCodeWrong = useSelector<RootState, boolean>(
		(rootState) => rootState.auth.isConfirmationCodeWrong,
	);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const checkConfirmationCode = useActionWithDeferred(AuthActions.confirmPhone);

	const [country, setCountry] = useState<country>(countryList[countryList.length - 1]);
	const [phone, setPhone] = useState<string>('');
	const [stage, setStage] = useState<LoginPageProps.Stages>(LoginPageProps.Stages.phoneInput);

	const [code, setCode] = useState<string[]>(['', '', '', '']);
	const [remainingSeconds, setRemainingSeconds] = useState<number>(60);

	const [isIntervalRunning, setIsIntervalRunning] = useState(true);

	const boxElements: React.RefObject<HTMLInputElement>[] = [
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
	];

	useInterval(
		() => {
			if (remainingSeconds === 0) {
				setIsIntervalRunning(false);
			}
			setRemainingSeconds((x) => x - 1);
		},
		isIntervalRunning ? 1000 : null,
		true,
	);

	const sendSms = useCallback(async () => {
		await sendSmsCode({ phoneNumber });
		setStage(2);
	}, [setStage, phone]);

	const checkCode = useCallback(
		async (code: string[]) => {
			if (code.every((element) => element.length === 1)) {
				console.log('NOT-REJECTED');
				checkConfirmationCode({ code: code!.join(''), phoneNumber })
					.then(() => {
						history.push('/chats');
					})
					.catch(() => {
						console.log('NOT-REJECTED1');
						setCode(['', '', '', '']);
					});
			}
		},
		[phoneNumber],
	);

	const onKeyPress = (key: number): void => {
		if (key === 0 && code[key] === '') {
			return;
		}
		if (code[key] === '') {
			boxElements[key - 1].current?.focus();
		} else {
			const codeCopy = code.slice();
			codeCopy[key] = '';
			setCode(codeCopy);
		}
	};

	const onChangeText = (key: number, text: string): void => {
		if (!checkIfCharacterIsNumeric(text) && key !== 0) {
			return;
		}

		const codeClone = code.slice();

		if (text.length === 1) {
			codeClone[key] = text;
		} else {
			codeClone[key] = text.replace(codeClone[key], '');
		}

		setCode(codeClone);

		if (key === NUMBER_OF_DIGITS.length - 1) {
			boxElements[key].current?.blur();

			if (codeClone.every((element) => element.length === 1)) {
				setIsIntervalRunning(false);
				checkCode(codeClone);
			}
		}

		if (codeClone[key] && key < 3) {
			boxElements[key + 1].current?.focus();
		}

		if (text === '' && key !== 0) {
			boxElements[key - 1].current?.focus();
		}
	};

	const input = (key: number): JSX.Element => {
		return (
			<input
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeText(key, event.target.value)}
				onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
					event.key === 'Backspace' && onKeyPress(key)
				}
				ref={boxElements[key]}
				value={code[key]}
				key={key}
				type='text'
				className='login-page__code-input'
			/>
		);
	};

	const resendPhoneConfirmationCode = (): void => {
		sendSmsCode({ phoneNumber });
		setRemainingSeconds(60);
		setIsIntervalRunning(true);
	};

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
					{codeFromServer && <p>Code: {codeFromServer}</p>}
				</div>
			)}
			{stage === LoginPageProps.Stages.codeInput && (
				<div className='login-page__container'>
					<p className='login-page__confirm-code'>{t('loginPage.confirm_code')}</p>
					<p className='login-page__code-sent'>{`${t('loginPage.code_sent_to')} ${new AsYouType().input(
						phoneNumber,
					)}`}</p>
					<div className='login-page__inputs-container'>{NUMBER_OF_DIGITS.map(input)}</div>
					<p className='login-page__timer'>{moment.utc(remainingSeconds * 1000).format('mm:ss')}</p>
					{(remainingSeconds > 0 || code.every((element) => element.length === 1)) && (
						<button
							disabled={!code.every((element) => element.length === 1)}
							onClick={() => checkCode(code)}
							className='login-page__button login-page__button--code-confirmation'
						>
							{t('loginPage.next')}
						</button>
					)}

					{remainingSeconds === 0 && (
						<button
							disabled={remainingSeconds > 0}
							onClick={() => resendPhoneConfirmationCode()}
							className='login-page__button login-page__button--resend-code'
						>
							{t('loginPage.resend')}
						</button>
					)}

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
