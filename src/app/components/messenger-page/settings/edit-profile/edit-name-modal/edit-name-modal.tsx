import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { MyProfileActions } from 'app/store/my-profile/actions';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-name-modal.scss';

namespace EditNameModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const EditNameModal = ({ close, isDisplayed }: EditNameModal.Props) => {
	const myProfile = useSelector(getMyProfileSelector);

	const updateMyProfile = useActionWithDeferred(MyProfileActions.updateMyProfileAction);

	const [firstName, setFirstName] = useState(myProfile?.firstName || '');
	const [lastName, setLastName] = useState(myProfile?.lastName || '');

	useEffect(() => {
		setFirstName(myProfile?.firstName || '');
		setLastName(myProfile?.lastName || '');
	}, [isDisplayed]);

	const changeFirstName = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setFirstName(event.target.value);
		},
		[setFirstName],
	);
	const changeLastName = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setLastName(event.target.value);
		},
		[setLastName],
	);

	const onSubmit = useCallback(() => {
		if (firstName !== myProfile?.firstName || lastName !== myProfile?.lastName) {
			updateMyProfile({ firstName, lastName });
			close();
		}
	}, [firstName, lastName, updateMyProfile]);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={'Edit Name'}
				closeModal={close}
				contents={
					<div className={'edit-name-modal'}>
						<div className='edit-name-modal__input-block'>
							<span className='edit-name-modal__input-label'>First Name</span>
							<input
								value={firstName}
								onChange={changeFirstName}
								type='text'
								className='edit-name-modal__input'
							/>
						</div>
						<div className='edit-name-modal__input-block'>
							<span className='edit-name-modal__input-label'>Last Name</span>
							<input
								value={lastName}
								onChange={changeLastName}
								type='text'
								className='edit-name-modal__input'
							/>
						</div>
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
						},

						position: 'left',
						onClick: onSubmit,
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditNameModal;
