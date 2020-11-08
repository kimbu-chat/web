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
						children: t('chatInfo.confirm'),
						style: {
							margin: '0',
							width: '50%',
						},
						onClick: deleteTheseMessages,
						position: 'left',
						width: 'auto',
						variant: 'contained',
						color: 'secondary',
					},
					{
						children: t('chatInfo.cancel'),
						style: {
							margin: '0 0 0 10px',
							color: '#6D7885',
							width: '50%',
						},
						onClick: onClose,
						position: 'left',
						width: 'auto',
						variant: 'outlined',
						color: 'default',
					},
				]}
			/>
		</WithBackground>
	);
};

export default DeleteMessageModal;
