import React, { useContext, useState, useRef, useCallback } from 'react';
import './code-confirmation.scss';

import { LocalizationContext } from 'app/app';
import { AuthActions } from 'app/store/auth/actions';
import { RootState } from 'app/store/root-reducer';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useSelector } from 'react-redux';
import useInterval from 'use-interval';
import { history } from '../../../../main';
import moment from 'moment';
import { AsYouType } from 'libphonenumber-js';

const NUMBER_OF_DIGITS = [0, 1, 2, 3];

const CodeConfirmation = () => {
	const { t } = useContext(LocalizationContext);

	const checkIfCharacterIsNumeric = (character: string): boolean => /^[0-9]+$/.test(character);

	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
	const codeFromServer = useSelector<RootState, string>((rootState) => rootState.auth.confirmationCode);
	const isConfirmationCodeWrong = useSelector<RootState, boolean>(
		(rootState) => rootState.auth.isConfirmationCodeWrong,
	);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const checkConfirmationCode = useActionWithDeferred(AuthActions.confirmPhone);

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

	const checkCode = useCallback(
		async (code: string[]) => {
			if (code.every((element) => element.length === 1)) {
				checkConfirmationCode({ code: code!.join(''), phoneNumber })
					.then(() => {
						history.push('/chats');
					})
					.catch(() => {
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
				className='code-confirmation__code-input'
			/>
		);
	};

	const resendPhoneConfirmationCode = (): void => {
		sendSmsCode({ phoneNumber });
		setRemainingSeconds(60);
		setIsIntervalRunning(true);
	};

	return (
		<div className='code-confirmation'>
			<div className='code-confirmation__container'>
				<p className='code-confirmation__confirm-code'>{t('loginPage.confirm_code')}</p>
				<p className='code-confirmation__code-sent'>{`${t('loginPage.code_sent_to')} ${new AsYouType().input(
					phoneNumber,
				)}`}</p>
				<div className='code-confirmation__inputs-container'>{NUMBER_OF_DIGITS.map(input)}</div>
				<p className='code-confirmation__timer'>{moment.utc(remainingSeconds * 1000).format('mm:ss')}</p>
				{(remainingSeconds > 0 || code.every((element) => element.length === 1)) && (
					<button
						disabled={!code.every((element) => element.length === 1)}
						onClick={() => checkCode(code)}
						className='code-confirmation__button code-confirmation__button--code-confirmation'
					>
						{t('loginPage.next')}
					</button>
				)}

				{remainingSeconds === 0 && (
					<button
						disabled={remainingSeconds > 0}
						onClick={() => resendPhoneConfirmationCode()}
						className='code-confirmation__button code-confirmation__button--resend-code'
					>
						{t('loginPage.resend')}
					</button>
				)}

				{isConfirmationCodeWrong && <p>{t('loginPage.wrong_code')}</p>}
				{codeFromServer}
			</div>
		</div>
	);
};

export default CodeConfirmation;
