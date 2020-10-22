import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ValidSvg from 'app/assets/icons/ic-check-filled.svg';
import InValidSvg from 'app/assets/icons/ic-dismiss.svg';
import './edit-username-modal.scss';

namespace EditUserNameModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const EditUserNameModal = ({ close, isDisplayed }: EditUserNameModal.Props) => {
	const myProfile = useSelector(getMyProfileSelector);

	const [userName, setUserName] = useState(myProfile?.nickname || '');

	useEffect(() => {
		setUserName(myProfile?.nickname || '');
	}, [isDisplayed]);

	const changeUserName = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setUserName(event.target.value);
		},
		[setUserName],
	);
	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={'Edit Username'}
				closeModal={close}
				contents={
					<div className={'edit-username-modal'}>
						<div className='edit-username-modal__input-block'>
							<span className='edit-username-modal__input-label'>Username</span>
							<div className='edit-username-modal__input-wrapper'>
								<input
									value={userName}
									onChange={changeUserName}
									type='text'
									className='edit-username-modal__input'
								/>
								{false && (
									<div className='edit-username-modal__valid'>
										<ValidSvg viewBox='0 0 25 25' />
									</div>
								)}
								{true && (
									<div className='edit-username-modal__invalid'>
										<InValidSvg viewBox='0 0 25 25' />
									</div>
								)}
							</div>
						</div>
						<span className='edit-username-modal__requirements'>You can use a-z, 0-9 and underscores.</span>
					</div>
				}
				buttons={[
					{
						text: 'Save',
						style: {
							color: '#fff',
							backgroundColor: '#3F8AE0',
							padding: '11px 0px',
							border: '1px solid rgb(215, 216, 217)',
							width: '100%',
							marginBottom: '10px',
							marginTop: '-5px',
						},

						position: 'left',
						onClick: () => {},
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditUserNameModal;
