import React, { useCallback, useContext, useState } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';
import ForwardModal from '../forward-modal/forward-modal';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import DeleteMessageModal from './delete-message-modal/delete-message-modal';

const SelectedMessagesData = () => {
	const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessageIds);
	const selectedMessagesCount = selectedMessages.length;
	const selectedChat = useSelector(getSelectedChatSelector);
	const selectedChatId = selectedChat?.id;

	const { t } = useContext(LocalizationContext);

	const copyMessage = useActionWithDispatch(MessageActions.copyMessages);
	const resetSelectedMessages = useActionWithDispatch(MessageActions.resetSelectedMessages);
	const replyToMessage = useActionWithDispatch(MessageActions.replyToMessage);
	const editMessage = useActionWithDispatch(MessageActions.editMessage);

	const resetSelectedMessagesForChat = useCallback(() => {
		resetSelectedMessages({ chatId: selectedChatId || -1 });
	}, [selectedChatId]);

	const copyTheseMessages = useCallback(() => {
		copyMessage({ chatId: selectedChatId || -1, messageIds: selectedMessages });
		resetSelectedMessagesForChat();
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

	//--Forward Message Logic
	const [messageIdsToForward, setMessageIdsToForward] = useState<number[]>([]);
	const changeForwardMessagesState = useCallback(() => {
		if (messageIdsToForward.length > 0) {
			setMessageIdsToForward([]);
		} else {
			setMessageIdsToForward(selectedMessages);
		}
	}, [setMessageIdsToForward, messageIdsToForward]);

	return (
		<div className='selected-messages-data'>
			<button onClick={changeForwardMessagesState} className='selected-messages-data__btn'>
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

			<FadeAnimationWrapper isDisplayed={deleteMessagesModalDisplayed}>
				<DeleteMessageModal
					close={changeDeleteMessagesModalDisplayedState}
					selectedMessages={selectedMessages}
				/>
			</FadeAnimationWrapper>

			<FadeAnimationWrapper isDisplayed={messageIdsToForward?.length > 0}>
				<ForwardModal messageIdsToForward={messageIdsToForward} close={changeForwardMessagesState} />
			</FadeAnimationWrapper>
		</div>
	);
};

export default SelectedMessagesData;
