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
		isDisplayed: boolean;
		hide: () => void;
	}
}

const DeleteChatModal = ({ isDisplayed, hide }: DeleteChatModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const leaveConference = useActionWithDeferred(ChatActions.leaveConference);

	const deleteConference = useCallback(async () => {
		await leaveConference(selectedChat);
	}, [leaveConference, selectedChat]);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={hide}>
			<Modal
				isDisplayed={isDisplayed}
				title='Delete chat'
				contents={t('chatInfo.leave-confirmation', { conferenceName: selectedChat.conference?.name })}
				highlightedInContents={`‘${selectedChat.conference?.name}‘`}
				closeModal={hide}
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
						onClick: deleteConference,
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
						onClick: hide,
					},
				]}
			/>
		</WithBackground>
	);
};

export default DeleteChatModal;
