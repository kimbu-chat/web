import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import CheckBoxSvg from 'app/assets/icons/ic-checkbox.svg';
import { MessageActions } from 'app/store/messages/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';

namespace DeleteMessageModal {
	export interface Props {
		onClose: () => void;
		selectedMessages: number[];
	}
}

const DeleteMessageModal: React.FC<DeleteMessageModal.Props> = ({ onClose, selectedMessages }) => {
	const { t } = useContext(LocalizationContext);

	const deleteMessage = useActionWithDispatch(MessageActions.deleteMessageSuccess);

	const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
	const changeDeleteForInterlocutorState = useCallback(() => {
		setDeleteForInterlocutor((oldState) => !oldState);
	}, [setDeleteForInterlocutor]);

	const selectedChat = useSelector(getSelectedChatSelector);
	const selectedChatId = selectedChat?.id;

	const deleteTheseMessages = useCallback(() => {
		deleteMessage({ chatId: selectedChatId as number, messageIds: selectedMessages });
	}, [selectedChatId, selectedMessages]);

	return (
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title='Delete message'
				contents={
					<div>
						<div className=''>
							{t('selectedMessagesData.deleteConfirmation', { count: selectedMessages.length })
								.split(selectedMessages.length + '')
								.map((text, index, arr) => (
									<React.Fragment key={index}>
										<span className='modal__contents__text'>{text}</span>
										{index < arr.length - 1 && (
											<span className='modal__contents__text modal__contents__text--highlighted'>
												{selectedMessages.length}
											</span>
										)}
									</React.Fragment>
								))}
						</div>
						<div className='selected-messages-data__delete-check'>
							<button
								className={`selected-messages-data__delete-check__btn`}
								onClick={changeDeleteForInterlocutorState}
							>
								{deleteForInterlocutor && <CheckBoxSvg />}
							</button>
							<span className='selected-messages-data__delete-check__btn-description'>{`Delete for ${
								selectedChat?.interlocutor
									? selectedChat?.interlocutor?.firstName + ' ' + selectedChat?.interlocutor?.lastName
									: selectedChat?.conference?.name
							}`}</span>
						</div>
					</div>
				}
				closeModal={onClose}
				buttons={[
					{
						text: t('chatInfo.confirm'),
						style: {
							color: 'rgb(255, 255, 255)',
							backgroundColor: 'rgb(209, 36, 51)',
							padding: '16px 49.5px',
							margin: '0',
						},
						position: 'left',
						onClick: deleteTheseMessages,
					},
					{
						text: t('chatInfo.cancel'),
						style: {
							color: 'rgb(109, 120, 133)',
							backgroundColor: 'rgb(255, 255, 255)',
							padding: '16px 38px',
							margin: '0 0 0 10px',
							border: '1px solid rgb(215, 216, 217)',
						},

						position: 'left',
						onClick: onClose,
					},
				]}
			/>
		</WithBackground>
	);
};

export default DeleteMessageModal;
