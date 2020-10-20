import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import React, { useCallback, useState } from 'react';
import './edit-name-modal.scss';

namespace EditNameModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const EditNameModal = ({ close, isDisplayed }: EditNameModal.Props) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

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
	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={'Edit Name'}
				closeModal={close}
				contents={
					<div className={'edit-name-modal'}>
						<div className='edit-name-modal__input-block'>
							<span className='edit-name-modal__input-label'></span>
							<input
								value={firstName}
								onChange={changeFirstName}
								type='text'
								className='edit-name-modal__input'
							/>
						</div>
						<div className='edit-name-modal__input-block'>
							<span className='edit-name-modal__input-label'></span>
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
							marginBottom: '-6px',
						},

						position: 'left',
						onClick: () => {},
					},
				]}
			/>
		</WithBackground>
	);
};

export default EditNameModal;
