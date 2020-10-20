import React, { useCallback, useContext, useState } from 'react';
import './chat-actions.scss';
import { UserPreview } from 'app/store/my-profile/models';
import { Chat } from 'app/store/chats/models';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';
import { ChatActions as DialogActions } from 'app/store/chats/actions';

//svg
import MuteSvg from 'app/assets/icons/ic-notifications-on.svg';
import UnmuteSvg from 'app/assets/icons/ic-notifications-off.svg';
import ClearSvg from 'app/assets/icons/ic-clear.svg';
import EditSvg from 'app/assets/icons/ic-edit.svg';
import DeleteSvg from 'app/assets/icons/ic-delete.svg';
import LeaveSvg from 'app/assets/icons/ic-leave-chat.svg';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { FriendActions } from 'app/store/friends/actions';

namespace ChatActions {
	export interface Props {
		addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
		displayCreateChat: () => void;
	}
}

const ChatActions = ({ addMembers, displayCreateChat }: ChatActions.Props) => {
	const { t } = useContext(LocalizationContext);

	const [leaveConferenceModalOpened, setLeaveConferenceModalOpened] = useState<boolean>(false);

	const removeChat = useActionWithDispatch(DialogActions.removeChat);
	const muteChat = useActionWithDispatch(DialogActions.muteChat);
	const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);

	const leaveConference = useActionWithDeferred(DialogActions.leaveConference);

	const membersForConference = useSelector<RootState, UserPreview[]>(
		(state) => state.friends.usersForSelectedConference,
	);
	const membersIdsForConference: (number | undefined)[] = membersForConference.map((user) => user?.id);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;
	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);

	const selectedIsFriend = (): boolean => {
		return friends.findIndex((friend: UserPreview) => friend.id === selectedChat.interlocutor?.id) > -1;
	};

	const deleteChat = useCallback(() => removeChat(selectedChat), [removeChat, selectedChat]);
	const changeLeaveConferenceModalOpenedState = useCallback(
		() => setLeaveConferenceModalOpened((oldState) => !oldState),
		[setLeaveConferenceModalOpened],
	);
	const deleteConference = useCallback(async () => {
		await leaveConference(selectedChat);
	}, [leaveConference, changeLeaveConferenceModalOpenedState, selectedChat]);
	const muteThisChat = useCallback(() => muteChat(selectedChat), [muteChat, selectedChat]);
	const deleteContact = useCallback(() => deleteFriend({ userIds: [selectedChat?.interlocutor?.id || -1] }), [
		deleteFriend,
		selectedChat?.interlocutor?.id,
	]);
	const createConference = useCallback(() => {
		displayCreateChat();
	}, [displayCreateChat, selectedChat?.interlocutor?.id]);

	return (
		<div className='chat-actions'>
			<div className='chat-actions__heading'>{t('chatActions.actions')}</div>
			<button onClick={muteThisChat} className='chat-actions__action'>
				{selectedChat.isMuted ? (
					<UnmuteSvg className='chat-actions__action__svg' />
				) : (
					<MuteSvg className='chat-actions__action__svg' />
				)}
				<span className='chat-actions__action__name'>
					{selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}
				</span>
			</button>
			<button className='chat-actions__action'>
				<ClearSvg className='chat-actions__action__svg' />
				<span className='chat-actions__action__name'>{t('chatActions.clear-history')}</span>
			</button>
			{selectedChat.interlocutor && (
				<button className='chat-actions__action'>
					<EditSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.edit-contact')}</span>
				</button>
			)}
			{selectedChat.interlocutor && selectedIsFriend() && (
				<button onClick={deleteContact} className='chat-actions__action'>
					<DeleteSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.delete-contact')}</span>
				</button>
			)}
			{selectedChat.interlocutor && selectedIsFriend() && (
				<button onClick={createConference} className='chat-actions__action'>
					<UnmuteSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.create-group')}</span>
				</button>
			)}
			{selectedChat.interlocutor && (
				<button onClick={deleteChat} className='chat-actions__action'>
					<UnmuteSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.delete-chat')}</span>
				</button>
			)}
			{selectedChat.conference && (
				<button onClick={changeLeaveConferenceModalOpenedState} className='chat-actions__action'>
					<LeaveSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.leave-chat')}</span>
				</button>
			)}
			{selectedChat.conference && (
				<button
					onClick={() => addMembers({ excludeIds: membersIdsForConference })}
					className='chat-actions__action'
				>
					<LeaveSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.add-users')}</span>
				</button>
			)}

			{
				//!Modal rendered with portal
			}

			<WithBackground
				isBackgroundDisplayed={leaveConferenceModalOpened}
				onBackgroundClick={changeLeaveConferenceModalOpenedState}
			>
				<Modal
					isDisplayed={leaveConferenceModalOpened}
					title='Delete chat'
					contents={t('chatInfo.leave-confirmation', { conferenceName: selectedChat.conference?.name })}
					highlightedInContents={`‘${selectedChat.conference?.name}‘`}
					closeModal={changeLeaveConferenceModalOpenedState}
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
							onClick: changeLeaveConferenceModalOpenedState,
						},
					]}
				/>
			</WithBackground>
		</div>
	);
};

export default React.memo(ChatActions);
