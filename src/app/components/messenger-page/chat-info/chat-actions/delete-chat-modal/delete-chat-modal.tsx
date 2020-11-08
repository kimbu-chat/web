import { LocalizationContext } from 'app/app';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { ChatActions } from 'app/store/chats/actions';
import { Chat } from 'app/store/chats/models';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';

namespace DeleteChatModal {
	export interface Props {
		hide: () => void;
	}
}

const DeleteChatModal = ({ hide }: DeleteChatModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const leaveConference = useActionWithDeferred(ChatActions.leaveConference);

	const deleteConference = useCallback(async () => {
		await leaveConference(selectedChat);
	}, [leaveConference, selectedChat]);

	return (
		<WithBackground onBackgroundClick={hide}>
			<Modal
				title='Delete chat'
				contents={t('chatInfo.leave-confirmation', { conferenceName: selectedChat.conference?.name })}
				highlightedInContents={`‘${selectedChat.conference?.name}‘`}
				closeModal={hide}
				buttons={[
					{
						children: t('chatInfo.confirm'),
						style: {
							margin: '0',
							width: '50%',
						},
						onClick: deleteConference,
						position: 'left',
						width: 'contained',
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
};

export default DeleteChatModal;
