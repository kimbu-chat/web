import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import React, { useCallback, useContext } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './forward-modal.scss';
import SearchBox from '../search-box/search-box';
import FriendFromList from '../friend-from-list/friend-from-list';
import { FriendActions } from 'app/store/friends/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';

namespace ForwardModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
		messageIdsToForward: number[];
	}
}

const ForwardModal = ({ close, isDisplayed }: ForwardModal.Props) => {
	const { t } = useContext(LocalizationContext);
	const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);
	const friends = useSelector((state: RootState) => state.friends.friends);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const isSelected = useCallback((id: number) => selectedChatIds.includes(id), [selectedChatIds]);

	const changeSelectedState = useCallback(
		(id: number) => {
			if (isSelected(id)) {
				setSelectedChatIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
			} else {
				setSelectedChatIds((oldChatIds) => [...oldChatIds, id]);
			}
		},
		[setSelectedChatIds, isSelected],
	);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			{isDisplayed && (
				<Modal
					title='Forward'
					closeModal={close}
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
							text: t('forwardModal.send'),
							style: {
								color: '#fff',
								backgroundColor: '#3F8AE0',
								padding: '11px 0px',
								border: '1px solid rgb(215, 216, 217)',
								width: '100%',
								marginBottom: '-6px',
							},

							position: 'left',
							onClick: () => {},
						},
					]}
				/>
			)}
		</WithBackground>
	);
};

export default ForwardModal;
