import React, { useCallback, useContext } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';

const SelectedMessagesData = () => {
	const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessageIds);
	const selectedMessagesCount = selectedMessages.length;
	const selectedChatId = useSelector(getSelectedChatSelector)?.id;

	const { t } = useContext(LocalizationContext);

	const copyMessage = useActionWithDispatch(MessageActions.copyMessages);
	const resetSelectedMessages = useActionWithDispatch(MessageActions.resetSelectedMessages);
	const deleteMessage = useActionWithDispatch(MessageActions.deleteMessageSuccess);

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

	return (
		<div className='selected-messages-data'>
			<button className='selected-messages-data__btn'>
				{t('selectedMessagesData.forward', { count: selectedMessagesCount })}
			</button>
			<button
				onClick={deleteTheseMessages}
				className='selected-messages-data__btn selected-messages-data__btn--delete'
			>
				{t('selectedMessagesData.delete', { count: selectedMessagesCount })}
			</button>
			{selectedMessagesCount === 1 && (
				<button className='selected-messages-data__btn'>{t('selectedMessagesData.reply')}</button>
			)}
			{selectedMessagesCount === 1 && (
				<button className='selected-messages-data__btn '>{t('selectedMessagesData.edit')}</button>
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
		</div>
	);
};

export default SelectedMessagesData;
