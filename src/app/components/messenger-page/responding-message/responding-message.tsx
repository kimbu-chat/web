import React from 'react';
import './responding-message.scss';

import CloseSVG from 'app/assets/icons/ic-close.svg';
import { RootState } from 'app/store/root-reducer';
import { useSelector } from 'react-redux';
import { MessageActions } from 'app/store/messages/actions';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';

const RespondingMessage = () => {
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
};

export default RespondingMessage;
