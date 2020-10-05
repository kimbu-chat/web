import React, { useCallback, useContext, useState } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';

import CheckBoxSvg from 'app/assets/icons/ic-checkbox.svg';

const SelectedMessagesData = () => {
	const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessageIds);
	const selectedMessagesCount = selectedMessages.length;
	const selectedChat = useSelector(getSelectedChatSelector);
	const selectedChatId = selectedChat?.id;

	const { t } = useContext(LocalizationContext);

	const copyMessage = useActionWithDispatch(MessageActions.copyMessages);
	const resetSelectedMessages = useActionWithDispatch(MessageActions.resetSelectedMessages);
	const deleteMessage = useActionWithDispatch(MessageActions.deleteMessageSuccess);
	const replyToMessage = useActionWithDispatch(MessageActions.replyToMessage);
	const editMessage = useActionWithDispatch(MessageActions.editMessage);

	const resetSelectedMessagesForChat = useCallback(() => {
		resetSelectedMessages({ chatId: selectedChatId || -1 });
	}, [selectedChatId]);

	const copyTheseMessages = useCallback(() => {
		copyMessage({ chatId: selectedChatId || -1, messageIds: selectedMessages });
		resetSelectedMessagesForChat();
	}, [selectedChatId, selectedMessages]);

	const deleteTheseMessages = useCallback(() => {
		deleteMessage({ chatId: selectedChatId as number, messageIds: selectedMessages });
	}, [selectedChatId, selectedMessages]);

	const replyToSelectedMessage = useCallback(() => {
		replyToMessage({ messageId: selectedMessages[0], chatId: selectedChatId as number });
	}, [replyToMessage, selectedMessages, selectedChatId]);

	const editSelectedMessage = useCallback(() => {
		editMessage({ messageId: selectedMessages[0], chatId: selectedChatId as number });
	}, [editMessage, selectedMessages, selectedChatId]);

	//--Delete message logic
	const [deleteMessagesModalDisplayed, setDeleteMessagesModalDisplayed] = useState(false);
	const changeDeleteMessagesModalDisplayedState = useCallback(() => {
		setDeleteMessagesModalDisplayed((oldState) => !oldState);
	}, [setDeleteMessagesModalDisplayed]);

	const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
	const changeDeleteForInterlocutorState = useCallback(() => {
		setDeleteForInterlocutor((oldState) => !oldState);
	}, [setDeleteForInterlocutor]);

	return (
		<div className='selected-messages-data'>
			<button className='selected-messages-data__btn'>
				{t('selectedMessagesData.forward', { count: selectedMessagesCount })}
			</button>
			<button
				onClick={changeDeleteMessagesModalDisplayedState}
				className='selected-messages-data__btn selected-messages-data__btn--delete'
			>
				{t('selectedMessagesData.delete', { count: selectedMessagesCount })}
			</button>
			{selectedMessagesCount === 1 && (
				<button onClick={replyToSelectedMessage} className='selected-messages-data__btn'>
					{t('selectedMessagesData.reply')}
				</button>
			)}
			{selectedMessagesCount === 1 && (
				<button onClick={editSelectedMessage} className='selected-messages-data__btn '>
					{t('selectedMessagesData.edit')}
				</button>
			)}
			<button onClick={copyTheseMessages} className='selected-messages-data__btn'>
				{t('selectedMessagesData.copy')}
			</button>
			<button
				onClick={resetSelectedMessagesForChat}
				className='selected-messages-data__btn selected-messages-data__btn--cancel'
			>
				{t('selectedMessagesData.cancel')}
			</button>

			{
				//!Dynamically displayed modal using React.Portal
			}
			<WithBackground
				isBackgroundDisplayed={deleteMessagesModalDisplayed}
				onBackgroundClick={changeDeleteMessagesModalDisplayedState}
			>
				{deleteMessagesModalDisplayed && (
					<Modal
						title='Delete message'
						contents={
							<div>
								<div className=''>
									{t('selectedMessagesData.deleteConfirmation', { count: selectedMessagesCount })
										.split(selectedMessagesCount + '')
										.map((text, index, arr) => (
											<React.Fragment key={index}>
												<span className='modal__contents__text'>{text}</span>
												{index < arr.length - 1 && (
													<span className='modal__contents__text modal__contents__text--highlighted'>
														{selectedMessagesCount}
													</span>
												)}
											</React.Fragment>
										))}
								</div>
								<div className='selected-messages-data__delete-check'>
									<button
										className={`selected-messages-data__delete-check__btn ${
											deleteForInterlocutor
												? 'selected-messages-data__delete-check__btn--active'
												: ''
										}`}
										onClick={changeDeleteForInterlocutorState}
									>
										{deleteForInterlocutor && <CheckBoxSvg viewBox='0 0 25 25' />}
									</button>
									<span className='selected-messages-data__delete-check__btn-description'>{`Delete for ${
										selectedChat?.interlocutor
											? selectedChat?.interlocutor?.firstName +
											  ' ' +
											  selectedChat?.interlocutor?.lastName
											: selectedChat?.conference?.name
									}`}</span>
								</div>
							</div>
						}
						closeModal={changeDeleteMessagesModalDisplayedState}
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
								onClick: changeDeleteMessagesModalDisplayedState,
							},
						]}
					/>
				)}
			</WithBackground>
		</div>
	);
};

export default SelectedMessagesData;
