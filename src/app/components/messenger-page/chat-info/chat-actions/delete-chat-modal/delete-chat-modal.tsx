import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { ChatActions } from 'store/chats/actions';
import { Chat } from 'store/chats/models';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import React, { useCallback, useContext } from 'react';
import './delete-chat-modal.scss';
import { useSelector } from 'react-redux';

namespace DeleteChatModal {
	export interface Props {
		hide: () => void;
	}
}

export const DeleteChatModal = React.memo(({ hide }: DeleteChatModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const leaveGroupChat = useActionWithDeferred(ChatActions.leaveGroupChat);

	const deleteGroupChat = useCallback(async () => {
		await leaveGroupChat(selectedChat);
	}, [leaveGroupChat, selectedChat]);

	return (
		<WithBackground onBackgroundClick={hide}>
			<Modal
				title='Delete chat'
				contents={t('chatInfo.leave-confirmation', { groupChatName: selectedChat.groupChat?.name })}
				highlightedInContents={`‘${selectedChat.groupChat?.name}‘`}
				closeModal={hide}
				buttons={[
					{
						children: t('chatInfo.confirm'),
						className: 'delete-chat-modal__confirm-btn',
						onClick: deleteGroupChat,
						position: 'left',
						width: 'contained',
						variant: 'contained',
						color: 'secondary',
					},
					{
						children: t('chatInfo.cancel'),
						className: 'delete-chat-modal__cancel-btn',
						onClick: hide,
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
