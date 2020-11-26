import React from 'react';
import './responding-message.scss';

import CloseSVG from 'icons/ic-close.svg';
import { RootState } from 'store/root-reducer';
import { useSelector } from 'react-redux';
import { MessageActions } from 'store/messages/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';

export const RespondingMessage = React.memo(() => {
	const replyingMessage = useSelector((state: RootState) => state.messages.messageToReply);

	const resetReplyToMessage = useActionWithDispatch(MessageActions.resetReplyToMessage);

	return (
		<div className='responding-message'>
			<div className='responding-message__line'></div>
			<div className='responding-message__message-wrapper'>
				<div className='responding-message__message-sender'>{`${replyingMessage?.userCreator.firstName} ${replyingMessage?.userCreator.lastName}`}</div>
				<div className='responding-message__message-contents'>{replyingMessage?.text}</div>
			</div>
			<button onClick={resetReplyToMessage} className='responding-message__close'>
				<CloseSVG viewBox='0 0 25 25' />
			</button>
		</div>
	);
});
