import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import React, { useCallback, useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './forward-modal.scss';
import SearchBox from '../search-box/search-box';
import FriendFromList from '../shared/friend-from-list/friend-from-list';
import { FriendActions } from 'app/store/friends/actions';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';

namespace ForwardModal {
	export interface Props {
		onClose: () => void;
		messageIdsToForward: number[];
	}
}

const ForwardModal = ({ onClose }: ForwardModal.Props) => {
	const { t } = useContext(LocalizationContext);
	const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

	const friends = useSelector((state: RootState) => state.friends.friends);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const isSelected = useCallback(
		(id: number) => {
			return selectedChatIds.includes(id);
		},
		[selectedChatIds],
	);

	const changeSelectedState = useCallback(
		(id: number) => {
			console.log(selectedChatIds);

			if (selectedChatIds.includes(id)) {
				setSelectedChatIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
			} else {
				setSelectedChatIds((oldChatIds) => [...oldChatIds, id]);
			}
		},
		[selectedChatIds],
	);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	return (
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title={t('forwardModal.forward')}
				closeModal={onClose}
				contents={
					<div className={'forward-modal'}>
						<SearchBox onChange={(e) => searchFriends(e.target.value)} />
						<div className='forward-modal__chats-block'>
							{friends.map((friend) => {
								return (
									<FriendFromList
										key={friend.id}
										friend={friend}
										isSelected={isSelected(friend.id)}
										changeSelectedState={changeSelectedState}
									/>
								);
							})}
						</div>
					</div>
				}
				buttons={[
					{
						children: t('forwardModal.send'),
						className: 'forward-modal__confirm-btn',
						onClick: () => {},
						position: 'left',
						width: 'contained',
						variant: 'contained',
						color: 'primary',
					},
				]}
			/>
		</WithBackground>
	);
};

export default ForwardModal;
