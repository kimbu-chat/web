import React, { useContext } from 'react';
import './search-top.scss';

import BurgerSvg from 'app/assets/icons/ic-menu.svg';
import SearchSvg from 'app/assets/icons/ic-search_16.svg';
import CreateChatSvg from 'app/assets/icons/ic-write-message.svg';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import { LocalizationContext } from 'app/app';

namespace SearchTop {
	export interface Props {
		displaySlider: () => void;
		displayCreateChat: () => void;
	}
}

export const DIALOGS_LIMIT = 25;

const SearchTop = ({ displaySlider, displayCreateChat }: SearchTop.Props) => {
	const { t } = useContext(LocalizationContext);

	const getChats = useActionWithDispatch(ChatActions.getChats);

	const handleChatSearchChange = (name: string): void => {
		getChats({
			name,
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,
			initiatedByScrolling: false,
			showHidden: true,
		});
	};

	return (
		<div className='messenger__search-top'>
			<button className='messenger__burger' onClick={displaySlider}>
				<BurgerSvg />
			</button>
			<div className='messenger__search'>
				<div className=''>
					<SearchSvg />
				</div>
				<input
					onChange={(e) => handleChatSearchChange(e.target.value)}
					type='text'
					placeholder={t('searchTop.search')}
				/>
			</div>
			<button onClick={displayCreateChat} className='messenger__create-chat-btn'>
				<CreateChatSvg />
			</button>
		</div>
	);
};

export default React.memo(SearchTop);
