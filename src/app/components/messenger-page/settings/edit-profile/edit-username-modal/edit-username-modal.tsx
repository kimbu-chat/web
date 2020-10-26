import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import React, { useContext, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ValidSvg from 'app/assets/icons/ic-check-filled.svg';
import InValidSvg from 'app/assets/icons/ic-dismiss.svg';
import './edit-username-modal.scss';
import { MyProfileActions } from 'app/store/my-profile/actions';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { LocalizationContext } from 'app/app';

namespace EditUserNameModal {
	export interface Props {
		close: () => void;
	}
}

const EditUserNameModal = ({ close }: EditUserNameModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);

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
				checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
					setIsNickNameAvailable(isAvailable);
				});
			}
		},
		[setNickname, setIsNickNameAvailable, checkNicknameAvailability],
	);

	const onSubmit = useCallback(() => {
		if (nickname !== myProfile?.nickname) {
			updateMyNickname({ nickname });
		}
		close();
	}, [nickname, updateMyNickname, myProfile]);

	return (
		<WithBackground onBackgroundClick={close}>
			<Modal
				title={t('editUsernameModal.edit_username')}
				closeModal={close}
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
						text: 'Save',
						style: {
							color: '#fff',
							backgroundColor:
								!nickname.match(nicknamePattern) || !isNickNameAvailable ? '#6ea2de' : '#3F8AE0',
							padding: '11px 0px',
							border: '1px solid rgb(215, 216, 217)',
							width: '100%',
							marginBottom: '10px',
							marginTop: '-5px',
						},
						disabled: !nickname.match(nicknamePattern) || !isNickNameAvailable,
						position: 'left',
						onClick: onSubmit,
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditUserNameModal;
