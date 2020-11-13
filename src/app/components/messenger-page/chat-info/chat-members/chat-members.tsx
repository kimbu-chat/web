import React, { useState, useEffect, useCallback } from 'react';
import './chat-members.scss';
import Member from './chat-member/chat-member';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { Chat } from 'app/store/chats/models';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { UserPreview } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';

import AddSvg from 'app/assets/icons/ic-add-new.svg';
import SearchBox from '../../search-box/search-box';

namespace ChatMembers {
	export interface Props {
		addMembers: () => void;
	}
}

const ChatMembers = ({ addMembers }: ChatMembers.Props) => {
	const [searchStr, setSearchStr] = useState<string>('');

	const getConferenceUsers = useActionWithDispatch(ChatActions.getConferenceUsers);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const membersForConference = useSelector<RootState, UserPreview[]>(
		(state) => state.friends.usersForSelectedConference,
	);

	useEffect(() => {
		getConferenceUsers({
			conferenceId: selectedChat.conference?.id || -1,
			page: { offset: 0, limit: 15 },
		});
		return () => {
			setSearchStr('');
		};
	}, [selectedChat.id]);

	//!remove when will be implemented
	//@ts-ignore
	const loadMore = useCallback(() => {
		getConferenceUsers({
			conferenceId: selectedChat.conference?.id || -1,
			page: { offset: membersForConference.length, limit: 15 },
			filters: {
				name: searchStr,
			},
		});
	}, [selectedChat]);

	return (
		<div className='chat-members'>
			<div className='chat-members__heading-block'>
				<h3 className='chat-members__heading'>Members</h3>
				<button onClick={() => addMembers()} className='chat-members__add'>
					<AddSvg viewBox='0 0 25 25' />
				</button>
			</div>

			<div className='chat-members__search'>
				<SearchBox
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSearchStr(e.target.value);
						getConferenceUsers({
							conferenceId: selectedChat.conference?.id || -1,
							page: { offset: 0, limit: 15 },
							filters: {
								name: e.target.value,
							},
						});
					}}
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
