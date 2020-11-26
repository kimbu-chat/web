import { Modal } from 'components';
import { WithBackground } from 'components';
import { getSelectedChatSelector } from 'store/chats/selectors';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import CheckBoxSvg from 'icons/ic-checkbox.svg';
import { MessageActions } from 'store/messages/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import './delete-message-modal.scss';

namespace DeleteMessageModal {
	export interface Props {
		onClose: () => void;
		selectedMessages: number[];
	}
}

export const DeleteMessageModal: React.FC<DeleteMessageModal.Props> = React.memo(({ onClose, selectedMessages }) => {
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
						<div className='delete-message-modal'>
							<button className={`delete-message-modal__btn`} onClick={changeDeleteForInterlocutorState}>
								{deleteForInterlocutor && <CheckBoxSvg />}
							</button>
							<span className='delete-message-modal__btn-description'>{`Delete for ${
								selectedChat?.interlocutor
									? selectedChat?.interlocutor?.firstName + ' ' + selectedChat?.interlocutor?.lastName
									: selectedChat?.groupChat?.name
							}`}</span>
						</div>
					</div>
				}
				closeModal={onClose}
				buttons={[
					{
						children: t('chatInfo.confirm'),
						className: 'delete-message-modal__confirm-btn',
						onClick: deleteTheseMessages,
						position: 'left',
						width: 'auto',
						variant: 'contained',
						color: 'secondary',
					},
					{
						children: t('chatInfo.cancel'),
						className: 'delete-message-modal__cancel-btn',
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
});
