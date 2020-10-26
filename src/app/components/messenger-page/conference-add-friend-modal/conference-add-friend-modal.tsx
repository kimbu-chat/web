import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import React, { useCallback, useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './conference-add-friend-modal.scss';
import SearchBox from '../search-box/search-box';
import FriendFromList from '../shared/friend-from-list/friend-from-list';
import { Chat } from 'app/store/chats/models';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useEffect } from 'react';
import { FriendActions } from 'app/store/friends/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';

namespace ConferenceAddFriendModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
	}
}

const ConferenceAddFriendModal = ({ close, isDisplayed }: ConferenceAddFriendModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);

	const friends = useSelector((state: RootState) => state.friends.friends);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;
	const idsToExclude = useSelector((state: RootState) => state.friends.usersForSelectedConference).map(
		(user) => user.id,
	);

	useEffect(() => {
		setselectedUserIds([]);
	}, [isDisplayed]);

	const addUsersToConferece = useActionWithDeferred(ChatActions.addUsersToConference);
	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

	const changeSelectedState = useCallback(
		(id: number) => {
			if (isSelected(id)) {
				setselectedUserIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
			} else {
				setselectedUserIds((oldChatIds) => [...oldChatIds, id]);
			}
		},
		[setselectedUserIds, isSelected],
	);

	const addUsers = useCallback((): void => {
		close();

		if (selectedUserIds.length > 0) {
			addUsersToConferece({ chat: selectedChat, userIds: selectedUserIds });
		}
	}, [addUsersToConferece, selectedChat, selectedUserIds, close]);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			<Modal
				isDisplayed={isDisplayed}
				title={t('conferenceAddFriendModal.add_members')}
				closeModal={close}
				contents={
					<div className={'conference-add-friend-modal'}>
						<SearchBox onChange={(e) => searchFriends(e.target.value)} />
						<div className='conference-add-friend-modal__friend-block'>
							{friends.map(
								(friend) =>
									!idsToExclude.includes(friend.id) && (
										<FriendFromList
											key={friend.id}
											friend={friend}
											isSelected={isSelected(friend.id)}
											changeSelectedState={changeSelectedState}
										/>
									),
							)}
						</div>
					</div>
				}
				buttons={[
					{
						text: t('conferenceAddFriendModal.add_members'),
						style: {
							backgroundColor: 'rgb(63, 138, 224)',
							color: '#fff',
							padding: '16px 49.5px',
							margin: '0',
							width: '100%',
						},
						position: 'left',
						onClick: addUsers,
					},
				]}
			/>
		</WithBackground>
	);
};

export default ConferenceAddFriendModal;
