import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import React, { useContext, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ValidSvg from 'icons/ic-check-filled.svg';
import InValidSvg from 'icons/ic-dismiss.svg';
import './edit-username-modal.scss';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { LocalizationContext } from 'app/app';

namespace EditUserNameModal {
	export interface Props {
		onClose: () => void;
	}
}

export const EditUserNameModal = React.memo(({ onClose }: EditUserNameModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const nicknamePattern = /^[a-z0-9_]{5,}$/;

	const myProfile = useSelector(getMyProfileSelector);

	const updateMyNickname = useActionWithDeferred(MyProfileActions.updateMyNicknameAction);
	const checkNicknameAvailability = useActionWithDeferred(MyProfileActions.checkNicknameAvailabilityAction);

	const [nickname, setNickname] = useState(myProfile?.nickname || '');

	const changeNickname = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newNickName = event.target.value;
			setNickname(newNickName);
			if (newNickName === myProfile?.nickname) {
				setIsNickNameAvailable(true);
			} else {
				setIsLoading(true);
				checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
					setIsNickNameAvailable(isAvailable);
					setIsLoading(false);
				});
			}
		},
		[setNickname, setIsNickNameAvailable, checkNicknameAvailability, setIsLoading],
	);

	const onSubmit = useCallback(() => {
		if (nickname !== myProfile?.nickname) {
			updateMyNickname({ nickname });
		}
		onClose();
	}, [nickname, updateMyNickname, myProfile]);

	return (
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title={t('editUsernameModal.edit_username')}
				closeModal={onClose}
				contents={
					<div className={'edit-username-modal'}>
						<div className='edit-username-modal__input-block'>
							<span className='edit-username-modal__input-label'>{t('editUsernameModal.username')}</span>
							<div className='edit-username-modal__input-wrapper'>
								<input
									value={nickname}
									onChange={changeNickname}
									type='text'
									className='edit-username-modal__input'
								/>
								{nickname.match(nicknamePattern) && isNickNameAvailable && (
									<div className='edit-username-modal__valid'>
										<ValidSvg viewBox='0 0 25 25' />
									</div>
								)}
								{(!nickname.match(nicknamePattern) || !isNickNameAvailable) && (
									<div className='edit-username-modal__invalid'>
										<InValidSvg viewBox='0 0 25 25' />
									</div>
								)}
							</div>
						</div>
						<span className='edit-username-modal__requirements'>{t('editUsernameModal.requirements')}</span>
					</div>
				}
				buttons={[
					{
						children: 'Save',
						className: 'edit-username-modal__confirm-btn',
						disabled: !nickname.match(nicknamePattern) || !isNickNameAvailable || isLoading,
						onClick: onSubmit,
						position: 'left',
						width: 'contained',
						variant: 'contained',
						isLoading: isLoading,
						color: 'primary',
					},
				]}
			/>
		</WithBackground>
	);
});
