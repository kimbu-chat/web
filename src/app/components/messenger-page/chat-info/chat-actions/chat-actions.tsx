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
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { FriendActions } from 'app/store/friends/actions';
import DeleteChatModal from './delete-chat-modal/delete-chat-modal';
import CreateConference from '../../create-conference-modal/create-conference-modal';

namespace ChatActions {
	export interface Props {
		addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
	}
}

const ChatActions = ({ addMembers }: ChatActions.Props) => {
	const { t } = useContext(LocalizationContext);

	const [leaveConferenceModalOpened, setLeaveConferenceModalOpened] = useState<boolean>(false);
	const changeLeaveConferenceModalOpenedState = useCallback(
		() => setLeaveConferenceModalOpened((oldState) => !oldState),
		[setLeaveConferenceModalOpened],
	);

	const [createConferenceModalOpened, setCreateConferenceModalOpened] = useState<boolean>(false);
	const changeCreateConferenceModalOpenedState = useCallback(
		() => setCreateConferenceModalOpened((oldState) => !oldState),
		[setCreateConferenceModalOpened],
	);

	const removeChat = useActionWithDispatch(DialogActions.removeChat);
	const muteChat = useActionWithDispatch(DialogActions.muteChat);
	const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);

	const membersForConference = useSelector<RootState, UserPreview[]>(
		(state) => state.friends.usersForSelectedConference,
	);
	const membersIdsForConference: (number | undefined)[] = membersForConference.map((user) => user?.id);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;
	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);

	const selectedIsFriend = useCallback((): boolean => {
		return friends.findIndex((friend: UserPreview) => friend.id === selectedChat.interlocutor?.id) > -1;
	}, [friends, selectedChat.interlocutor?.id]);

	const deleteChat = useCallback(() => removeChat(selectedChat), [removeChat, selectedChat]);
	const muteThisChat = useCallback(() => muteChat(selectedChat), [muteChat, selectedChat]);
	const deleteContact = useCallback(() => deleteFriend({ userIds: [selectedChat?.interlocutor?.id || -1] }), [
		deleteFriend,
		selectedChat?.interlocutor?.id,
	]);

	return (
		<div className='chat-actions'>
			<div className='chat-actions__heading'>{t('chatActions.actions')}</div>
			<button onClick={muteThisChat} className='chat-actions__action'>
				{selectedChat.isMuted ? (
					<UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
				) : (
					<MuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
				)}
				<span className='chat-actions__action__name'>
					{selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}
				</span>
			</button>
			<button className='chat-actions__action'>
				<ClearSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
				<span className='chat-actions__action__name'>{t('chatActions.clear-history')}</span>
			</button>
			{selectedChat.interlocutor && (
				<button className='chat-actions__action'>
					<EditSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.edit-contact')}</span>
				</button>
			)}
			{selectedChat.interlocutor && selectedIsFriend() && (
				<button onClick={deleteContact} className='chat-actions__action'>
					<DeleteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.delete-contact')}</span>
				</button>
			)}
			{selectedChat.interlocutor && selectedIsFriend() && (
				<button onClick={changeCreateConferenceModalOpenedState} className='chat-actions__action'>
					<UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.create-group')}</span>
				</button>
			)}
			{selectedChat.interlocutor && (
				<button onClick={deleteChat} className='chat-actions__action'>
					<UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.delete-chat')}</span>
				</button>
			)}
			{selectedChat.conference && (
				<button onClick={changeLeaveConferenceModalOpenedState} className='chat-actions__action'>
					<LeaveSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.leave-chat')}</span>
				</button>
			)}
			{selectedChat.conference && (
				<button
					onClick={() => addMembers({ excludeIds: membersIdsForConference })}
					className='chat-actions__action'
				>
					<LeaveSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.add-users')}</span>
				</button>
			)}

			{
				//!Modal rendered with portal
			}

			<DeleteChatModal isDisplayed={leaveConferenceModalOpened} hide={changeLeaveConferenceModalOpenedState} />
			{selectedChat.interlocutor && (
				<CreateConference
					isDisplayed={createConferenceModalOpened}
					preSelectedUserIds={[selectedChat.interlocutor!.id]}
					close={changeCreateConferenceModalOpenedState}
				/>
			)}
		</div>
	);
};

export default React.memo(ChatActions);
