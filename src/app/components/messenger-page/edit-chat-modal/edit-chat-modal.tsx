import React from 'react';
import './edit-chat-modal.scss';

import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';

import CloseSVG from 'app/assets/icons/ic-close.svg';

namespace EditChatModal {
	export interface Props {
		isDisplayed: boolean;
		close: () => void;
	}
}

const ContentOfModal = () => {
	return (
		<div className='edit-chat-modal'>
			<div className='edit-chat-modal__change-photo'>
				<div className='edit-chat-modal__current-photo-wrapper'>
					<img src='https://i.imgur.com/Q0QbOsw.jpeg' alt='' className='edit-chat-modal__current-photo' />
					<button className='edit-chat-modal__remove-photo'>
						<CloseSVG viewBox='0 0 25 25' />
					</button>
				</div>
				<div className='edit-chat-modal__change-photo-data'>
					<button className='edit-chat-modal__change-photo__btn'>Upload New Photo</button>
					<span className='edit-chat-modal__change-photo__description'>
						At least 256 x 256px PNG or JPG file.
					</span>
				</div>
			</div>
			<div className='edit-chat-modal__name'>
				<span className='edit-chat-modal__name__label'>Name</span>
				<input type='text' className='edit-chat-modal__name__input' />
			</div>
			<div className='edit-chat-modal__description'>
				<span className='edit-chat-modal__description__label'>Description (optional)</span>
				<textarea className='edit-chat-modal__description__input' />
			</div>
		</div>
	);
};

const EditChatModal = ({ isDisplayed, close }: EditChatModal.Props) => {
	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			{isDisplayed && (
				<Modal
					title='Edit group'
					contents={<ContentOfModal />}
					closeModal={close}
					buttons={[
						{
							text: 'Save',
							style: {
								color: '#fff',
								backgroundColor: 'rgb(63, 138, 224)',
								padding: '11px 92.5px',
								marginRight: '20px',
							},
							position: 'left',
							onClick: () => console.log('Place submit Here'),
						},
						{
							text: 'Cancel',
							style: {
								color: 'rgb(109, 120, 133)',
								backgroundColor: 'white',
								padding: '11px 48px',
								border: '1px solid rgb(215, 216, 217)',
							},

							position: 'left',
							onClick: close,
						},
					]}
				/>
			)}
		</WithBackground>
	);
};

export default EditChatModal;
