import React, { useCallback } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';

const SelectedMessagesData = () => {
	const selectedMessages = useSelector((state: RootState) => state.messages.selectedMessageIds);
	const selectedChatId = useSelector(getSelectedChatSelector)?.id;

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
			<p className='selected-messages-data__info'>{selectedMessages.length} сообщения:</p>
			<button onClick={deleteTheseMessages} className='selected-messages-data__btn'>
				<div className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='evenodd'
							d='M1.818 3.185l3.209.005v-.836a1.802 1.802 0 0 1 1.8-1.8H9.16a1.803 1.803 0 0 1 1.8 1.8v.847l3.206.005a.8.8 0 1 1-.003 1.6h-.386a.819.819 0 0 1 .005.081l.011 5.049v.027l.007 3.018a2.803 2.803 0 0 1-2.8 2.807H5.005a2.8 2.8 0 0 1-2.8-2.807l.007-3.045v-.018l.011-5.03c0-.035.002-.07.007-.102l-.415-.001a.8.8 0 1 1 .003-1.6zm1.999 1.603a.807.807 0 0 1 .006.103l-.011 5.03v.018l-.007 3.046a1.201 1.201 0 0 0 1.2 1.203H11a1.2 1.2 0 0 0 1.2-1.203l-.007-3.019V9.94l-.011-5.048c0-.03.001-.06.004-.088l-8.37-.015zm5.543-1.59l-2.733-.005v-.839a.2.2 0 0 1 .2-.2H9.16a.2.2 0 0 1 .2.2v.844zM5.714 6.542l-.029 5.715a.8.8 0 0 0 1.6.008l.029-5.715a.8.8 0 1 0-1.6-.008zM8.7 12.257l.028-5.715a.8.8 0 1 1 1.6.008l-.028 5.715a.8.8 0 0 1-1.6-.008z'
							clipRule='evenodd'
						></path>
					</svg>
				</div>
				<span>Удалить</span>
			</button>
			<button onClick={copyTheseMessages} className='selected-messages-data__btn'>
				<div className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='evenodd'
							d='M13 .2c1 0 1.8.8 1.8 1.8v8c0 1-.8 1.8-1.8 1.8h-2.2V13c0 1-.8 1.8-1.8 1.8H3c-1 0-1.8-.8-1.8-1.8V5C1.2 4 2 3.2 3 3.2h2.2V2C5.2 1 6 .2 7 .2h6zm-6.2 3H9c1 0 1.8.8 1.8 1.8v5.2H13c.1 0 .2 0 .2-.2V2c0-.1 0-.2-.2-.2H7c-.1 0-.2 0-.2.2v1.2zM9.2 5v8c0 .1 0 .2-.2.2H3c-.1 0-.2 0-.2-.2V5c0-.1 0-.2.2-.2h6c.1 0 .2 0 .2.2z'
							clipRule='evenodd'
						></path>
					</svg>
				</div>
				<span>Копировать</span>
			</button>
			<button onClick={resetSelectedMessagesForChat} className='selected-messages-data__close-btn'>
				<div className='svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
						<path
							fillRule='evenodd'
							d='M6.84 8L3.25 4.4a.8.8 0 1 1 1.13-1.13l3.6 3.59 3.58-3.6a.8.8 0 0 1 1.13 1.14L9.1 8l3.59 3.58a.8.8 0 0 1-1.13 1.14l-3.59-3.6-3.59 3.6a.8.8 0 0 1-1.13-1.14L6.84 8z'
						></path>
					</svg>
				</div>
			</button>
		</div>
	);
};

export default SelectedMessagesData;
