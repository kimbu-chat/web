import React, { useCallback, useState } from 'react';
import './search-top.scss';

import BurgerSvg from 'app/assets/icons/ic-menu.svg';
import CreateChatSvg from 'app/assets/icons/ic-write-message.svg';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import SearchBox from '../search-box/search-box';
import NewChatModal from '../new-chat/new-chat';

namespace SearchTop {
	export interface Props {
		displaySlider: () => void;
	}
}

export const DIALOGS_LIMIT = 25;

const SearchTop = ({ displaySlider }: SearchTop.Props) => {
	const getChats = useActionWithDispatch(ChatActions.getChats);
	const [newChatDisplayed, setNewChatDisplayed] = useState(false);
	const changeNewChatDisplayedState = useCallback(() => {
		setNewChatDisplayed((oldState) => !oldState);
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
			<button className='search-top__burger' onClick={displaySlider}>
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

			<NewChatModal isDisplayed={newChatDisplayed} close={changeNewChatDisplayedState} />
		</div>
	);
};

export default React.memo(SearchTop);
