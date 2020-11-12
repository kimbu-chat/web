import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import './code-confirmation.scss';

import { LocalizationContext } from 'app/app';
import { AuthActions } from 'app/store/auth/actions';
import { RootState } from 'app/store/root-reducer';
import { useActionWithDeferred } from 'app/utils/hooks/use-action-with-deferred';
import { useSelector } from 'react-redux';
import useInterval from 'use-interval';
import { history } from '../../../../main';
import moment from 'moment';
import { parsePhoneNumber } from 'libphonenumber-js';
import ResendSvg from 'app/assets/icons/ic-resend.svg';
import BaseBtn from 'app/components/shared/base-btn/base-btn';

const NUMBER_OF_DIGITS = [0, 1, 2, 3];

namespace CodeConfirmation {
	export interface Props {
		preloadNext: () => void;
	}
}

const CodeConfirmation: React.FC<CodeConfirmation.Props> = ({ preloadNext }) => {
	const { t } = useContext(LocalizationContext);

	const checkIfCharacterIsNumeric = (character: string): boolean => /^[0-9]+$/.test(character);

	const [code, setCode] = useState<string[]>(['', '', '', '']);
	const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
	const [isIntervalRunning, setIsIntervalRunning] = useState(true);

	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
	const codeFromServer = useSelector<RootState, string>((rootState) => rootState.auth.confirmationCode);
	const isConfirmationCodeWrong = useSelector<RootState, boolean>(
		(rootState) => rootState.auth.isConfirmationCodeWrong,
	);
	const isLoading = useSelector((state: RootState) => state.auth.loading);

	const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
	const checkConfirmationCode = useActionWithDeferred(AuthActions.confirmPhone);

	const boxElements: React.RefObject<HTMLInputElement>[] = [
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
	];

	useInterval(
		() => {
			if (isIntervalRunning) {
				if (remainingSeconds === 1) {
					setIsIntervalRunning(false);
				}
				setRemainingSeconds((x) => x - 1);
			}
		},
		isIntervalRunning ? 1000 : null,
		true,
	);

	useEffect(() => {
		preloadNext();

		return () => {
			setIsIntervalRunning(false);
		};
	}, []);

	const checkCode = useCallback(
		(code: string[]) => {
			if (code.every((element) => element.length === 1)) {
				checkConfirmationCode({ code: code!.join(''), phoneNumber })
					.then(() => {
						history.push('/chats');
						setIsIntervalRunning(false);
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
		if (!(code[key] === '')) {
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

		if (codeClone[key] && key < 3) {
			boxElements[key + 1].current?.focus();
		}

		if (codeClone.every((element) => element.length === 1)) {
			boxElements[key].current?.blur();

			checkCode(codeClone);
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
				className={`code-confirmation__code-input ${
					isConfirmationCodeWrong ? 'code-confirmation__code-input--wrong' : ''
				}`}
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
				<p
					style={{ marginBottom: isConfirmationCodeWrong ? '20px' : '50px' }}
					className='code-confirmation__code-sent'
					onClick={() => setCode(String(codeFromServer).split(''))}
				>{`${t('loginPage.code_sent_to')} ${parsePhoneNumber(phoneNumber).formatInternational()}`}</p>
				{isConfirmationCodeWrong && (
					<p className='code-confirmation__wrong-code'>{t('loginPage.wrong_code')}</p>
				)}
				<div className='code-confirmation__inputs-container'>{NUMBER_OF_DIGITS.map(input)}</div>
				{!(remainingSeconds === 0) && (
					<>
						<p className='code-confirmation__timer'>
							{t('loginPage.reset_timer', { time: moment.utc(remainingSeconds * 1000).format('mm:ss') })}
						</p>

						<BaseBtn
							disabled={
								isConfirmationCodeWrong || !code.every((element) => element.length === 1) || isLoading
							}
							onClick={() => checkCode(code)}
							variant={'contained'}
							color={'primary'}
							width={'contained'}
							isLoading={isLoading}
						>
							{t('loginPage.next')}
						</BaseBtn>
					</>
				)}

				{remainingSeconds === 0 && (
					<BaseBtn
						icon={<ResendSvg viewBox='0 0 25 25' />}
						disabled={remainingSeconds > 0}
						onClick={() => resendPhoneConfirmationCode()}
						variant={'outlined'}
						color={'primary'}
						width={'auto'}
						className='code-confirmation__resend-btn'
					>
						{t('loginPage.resend')}
					</BaseBtn>
				)}
			</div>
		</div>
	);
};

export default CodeConfirmation;
