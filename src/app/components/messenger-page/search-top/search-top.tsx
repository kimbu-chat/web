import React, { useCallback, useState } from 'react';
import './search-top.scss';

import CreateChatSvg from 'app/assets/icons/ic-write-message.svg';

import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import SearchBox from '../search-box/search-box';
import NewChatModal from '../new-chat-modal/new-chat-modal';
import CreateGroupChat from '../create-group-chat-modal/create-group-chat-modal';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';

export const DIALOGS_LIMIT = 25;

const SearchTop = () => {
	const getChats = useActionWithDispatch(ChatActions.getChats);
	const [newChatDisplayed, setNewChatDisplayed] = useState(false);
	const changeNewChatDisplayedState = useCallback(() => {
		setNewChatDisplayed((oldState) => !oldState);
	}, [setNewChatDisplayed]);

	const [createGroupChatDisplayed, setCreateGroupChatDisplayed] = useState(false);
	const changeCreateGroupChatDisplayedState = useCallback(() => {
		setCreateGroupChatDisplayed((oldState) => !oldState);
	}, [setNewChatDisplayed]);

	const handleChatSearchChange = (name: string): void => {
		getChats({
			name,
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,
			showOnlyHidden: false,
			showAll: true,
		});
	};

	return (
		<div className='search-top'>
			<div className='search-top__search'>
				<SearchBox
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChatSearchChange(e.target.value)}
				/>
			</div>
			<button onClick={changeNewChatDisplayedState} className='search-top__create-chat-btn'>
				<CreateChatSvg />
			</button>
			<FadeAnimationWrapper isDisplayed={newChatDisplayed}>
				<NewChatModal
					displayCreateGroupChat={changeCreateGroupChatDisplayedState}
					onClose={changeNewChatDisplayedState}
				/>
			</FadeAnimationWrapper>
			<FadeAnimationWrapper isDisplayed={createGroupChatDisplayed}>
				<CreateGroupChat onClose={changeCreateGroupChatDisplayedState} />
			</FadeAnimationWrapper>
		</div>
	);
};

export default React.memo(SearchTop);
