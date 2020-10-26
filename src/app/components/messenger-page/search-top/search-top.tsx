import React, { useCallback, useState } from 'react';
import './search-top.scss';

import BurgerSvg from 'app/assets/icons/ic-menu.svg';
import CreateChatSvg from 'app/assets/icons/ic-write-message.svg';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import SearchBox from '../search-box/search-box';
import NewChatModal from '../new-chat-modal/new-chat-modal';
import CreateConference from '../create-conference-modal/create-conference-modal';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';

export const DIALOGS_LIMIT = 25;

const SearchTop = () => {
	const getChats = useActionWithDispatch(ChatActions.getChats);
	const [newChatDisplayed, setNewChatDisplayed] = useState(false);
	const changeNewChatDisplayedState = useCallback(() => {
		setNewChatDisplayed((oldState) => !oldState);
	}, [setNewChatDisplayed]);

	const [createConferenceDisplayed, setCreateConferenceDisplayed] = useState(false);
	const changeCreateConferenceDisplayedState = useCallback(() => {
		setCreateConferenceDisplayed((oldState) => !oldState);
	}, [setNewChatDisplayed]);

	const handleChatSearchChange = (name: string): void => {
		getChats({
			name,
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,
			initiatedByScrolling: false,
			showOnlyHidden: false,
			showAll: true,
		});
	};

	return (
		<div className='search-top'>
			<button className='search-top__burger'>
				<BurgerSvg />
			</button>
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
					displayCreateConference={changeCreateConferenceDisplayedState}
					close={changeNewChatDisplayedState}
				/>
			</FadeAnimationWrapper>

			<FadeAnimationWrapper isDisplayed={createConferenceDisplayed}>
				<CreateConference close={changeCreateConferenceDisplayedState} />
			</FadeAnimationWrapper>
		</div>
	);
};

export default React.memo(SearchTop);
