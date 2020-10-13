import React, { useState, useEffect, useContext, useCallback } from 'react';
import './contact-search.scss';
import ContactItem from './contact-item/contact-item';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';

import { useSelector } from 'react-redux';
import { FriendActions } from 'app/store/friends/actions';
import { RootState } from 'app/store/root-reducer';
import { UserPreview } from 'app/store/my-profile/models';
import { LocalizationContext } from 'app/app';
import { MessageActions } from 'app/store/messages/actions';
import { useHistory } from 'react-router';

namespace ContactSearch {
	export interface Props {
		hide: () => void;
		isDisplayed: boolean;
	}
}

const ContactSearch = ({ hide, isDisplayed }: ContactSearch.Props) => {
	const { t } = useContext(LocalizationContext);
	const loadFriends = useActionWithDispatch(FriendActions.getFriends);
	const createChat = useActionWithDispatch(MessageActions.createChat);

	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);

	const history = useHistory();

	const [searchFriendStr, setSearchFriendStr] = useState<string>('');

	const searchFriends = useCallback((name: string) => {
		setSearchFriendStr(name);
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	const createEmptyChat = useCallback((user: UserPreview) => {
		createChat(user);
		const chatId = Number(`${user.id}1`);
		history.push(`/chats/${chatId}`);
		hide();
	}, []);

	useEffect(() => {
		searchFriends('');

		return () => {
			loadFriends({ page: { offset: 0, limit: 100 }, name, initializedBySearch: true });
		};
	}, [isDisplayed]);

	return (
		<div className={isDisplayed ? 'contact-search contact-search--active' : 'contact-search'}>
			<div className='contact-search__header'>
				<button onClick={hide} className='contact-search__back flat'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path d='M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z'></path>
						</svg>
					</div>
					<span>{t('back')}</span>
				</button>
				<div className='contact-search__title'>{t('contactsSearch.contactsSearch')}</div>
				<div className=''></div>
			</div>
			<div className='contact-search__contacts-select'>
				<input
					placeholder={t('contactsSearch.contactsSearch')}
					type='text'
					className='contact-search__contact-name'
					onChange={(e) => searchFriends(e.target.value)}
					value={searchFriendStr}
				/>
				<div className='contact-search__contacts-list'>
					{friends.map((friend) => (
						<ContactItem key={friend.id} onClick={createEmptyChat} user={friend} />
					))}
				</div>
			</div>
		</div>
	);
};

export default React.memo(ContactSearch, (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed);
