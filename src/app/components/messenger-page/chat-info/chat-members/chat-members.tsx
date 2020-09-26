import React, { useState, useEffect, useContext, useCallback } from 'react';
import './chat-members.scss';
import Member from './chat-member/chat-member';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { Chat } from 'app/store/chats/models';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { UserPreview } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';

import AddSvg from 'app/assets/icons/ic-add-new.svg';
import SearchSvg from 'app/assets/icons/ic-search.svg';

namespace ChatMembers {
	export interface Props {
		addMembers: (params: object) => void;
	}
}

const ChatMembers = ({ addMembers }: ChatMembers.Props) => {
	const { t } = useContext(LocalizationContext);

	const [searchStr, setSearchStr] = useState<string>('');

	const getConferenceUsers = useActionWithDispatch(ChatActions.getConferenceUsers);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const membersForConference = useSelector<RootState, UserPreview[]>(
		(state) => state.friends.usersForSelectedConference,
	);

	const membersIdsForConference: (number | undefined)[] = membersForConference.map((user) => user?.id);

	useEffect(() => {
		getConferenceUsers({
			conferenceId: selectedChat.conference?.id || -1,
			initiatedByScrolling: false,
			page: { offset: 0, limit: 15 },
		});
		return () => {
			setSearchStr('');
		};
	}, [selectedChat.id]);

	const loadMore = useCallback(() => {
		getConferenceUsers({
			conferenceId: selectedChat.conference?.id || -1,
			initiatedByScrolling: true,
			page: { offset: membersForConference.length, limit: 15 },
			filters: {
				name: searchStr,
			},
		});
	}, [selectedChat]);

	//!remove when will be implemented
	console.log(loadMore);

	return (
		<div className='chat-members'>
			<div className='chat-members__heading-block'>
				<h3 className='chat-members__heading'>Members</h3>
				<button
					onClick={() => addMembers({ excludeIds: membersIdsForConference })}
					className='chat-members__add'
				>
					<AddSvg viewBox='0 0 25 25' />
				</button>
			</div>
			<div className='chat-members__input-wrapper'>
				<SearchSvg viewBox='0 0 25 25' />
				<input
					onChange={(e) => {
						setSearchStr(e.target.value);
						getConferenceUsers({
							conferenceId: selectedChat.conference?.id || -1,
							initiatedByScrolling: false,
							page: { offset: 0, limit: 15 },
							filters: {
								name: e.target.value,
							},
						});
					}}
					type='text'
					placeholder={t('chatMembers.search')}
					className='chat-members__search'
				/>
			</div>
			<div className='chat-members__members-list'>
				{membersForConference.map((member) => (
					<Member member={member} key={member?.id} />
				))}
			</div>
		</div>
	);
};

export default React.memo(ChatMembers);
