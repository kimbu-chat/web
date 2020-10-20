import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import React from 'react';
import './edit-name-modal.scss';

namespace EditNameModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const EditNameModal = ({ close, isDisplayed }: EditNameModal.Props) => {
	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={'Edit Name'}
				closeModal={close}
				contents={<div className={'edit-name-modal'}></div>}
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
