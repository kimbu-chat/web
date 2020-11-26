import { Modal, WithBackground } from 'components';
import { RootState } from 'store/root-reducer';
import React, { useCallback, useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './group-chat-add-friend-modal.scss';
import { SearchBox } from '../search-box/search-box';
import { FriendFromList } from '../shared/friend-from-list/friend-from-list';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';

namespace GroupChatAddFriendModal {
	export interface Props {
		onClose: () => void;
	}
}

export const GroupChatAddFriendModal = React.memo(({ onClose }: GroupChatAddFriendModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const [selectedUserIds, setselectedUserIds] = useState<number[]>([]);

	const friends = useSelector((state: RootState) => state.friends.friends);
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;
	const idsToExclude = useSelector((state: RootState) => state.friends.usersForSelectedGroupChat).map(
		(user) => user.id,
	);

	const addUsersToGroupChat = useActionWithDeferred(ChatActions.addUsersToGroupChat);
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
		onClose();

		if (selectedUserIds.length > 0) {
			addUsersToGroupChat({
				chat: selectedChat,
				users: friends.filter((friend) => selectedUserIds.includes(friend.id)),
			});
		}
	}, [addUsersToGroupChat, selectedChat, selectedUserIds, close, friends]);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	return (
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title={t('groupChatAddFriendModal.add_members')}
				closeModal={onClose}
				contents={
					<div className={'group-chat-add-friend-modal'}>
						<SearchBox onChange={(e) => searchFriends(e.target.value)} />
						<div className='group-chat-add-friend-modal__friend-block'>
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
						children: t('groupChatAddFriendModal.add_members'),
						onClick: addUsers,
						disabled: selectedUserIds.length === 0,
						position: 'left',
						width: 'contained',
						variant: 'contained',
						color: 'primary',
					},
				]}
			/>
		</WithBackground>
	);
});
