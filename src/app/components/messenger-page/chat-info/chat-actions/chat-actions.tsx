import React, { useContext } from 'react';
import './chat-actions.scss';
import { UserPreview } from 'app/store/my-profile/models';
import { Chat } from 'app/store/chats/models';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';

//svg
import MuteSvg from 'app/assets/icons/ic-notifications-on.svg';
import UnmuteSvg from 'app/assets/icons/ic-notifications-on.svg';
import ClearSvg from 'app/assets/icons/ic-clear.svg';
import EditSvg from 'app/assets/icons/ic-edit.svg';
import DeleteSvg from 'app/assets/icons/ic-delete.svg';
import LeaveSvg from 'app/assets/icons/ic-leave-chat.svg';

namespace ChatActions {
	export interface Props {
		muteChat: () => void;
		createConference?: () => void;
		deleteContact?: () => void;
		deleteChat?: () => void;
		deleteConference?: () => void;
		addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
	}
}

const ChatActions = ({
	muteChat,
	createConference,
	deleteContact,
	deleteChat,
	deleteConference,
	addMembers,
}: ChatActions.Props) => {
	const { t } = useContext(LocalizationContext);

	const membersForConference = useSelector<RootState, UserPreview[]>(
		(state) => state.friends.usersForSelectedConference,
	);

	const membersIdsForConference: (number | undefined)[] = membersForConference.map((user) => user?.id);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;
	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);

	const selectedIsFriend = (): boolean => {
		return friends.findIndex((friend: UserPreview) => friend.id === selectedChat.interlocutor?.id) > -1;
	};

	return (
		<div className='chat-actions'>
			<div className='chat-actions__heading'>{t('chatActions.actions')}</div>
			<button onClick={muteChat} className='chat-actions__action'>
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
			{selectedChat.interlocutor && selectedIsFriend && (
				<button onClick={deleteContact} className='chat-actions__action'>
					<DeleteSvg className='chat-actions__action__svg' />
					<span className='chat-actions__action__name'>{t('chatActions.delete-contact')}</span>
				</button>
			)}
			{selectedChat.interlocutor && selectedIsFriend && (
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
				<button onClick={deleteConference} className='chat-actions__action'>
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
		</div>
	);
};

export default React.memo(ChatActions);
