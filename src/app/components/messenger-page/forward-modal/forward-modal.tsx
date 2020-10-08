import Avatar from 'app/components/shared/avatar/avatar';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import React, { useCallback } from 'react';
import { useState } from 'react';
import SelectedSvg from 'app/assets/icons/ic-check-filled.svg';
import UnSelectedSvg from 'app/assets/icons/ic-check-outline.svg';
import { useSelector } from 'react-redux';
import SearchSvg from 'app/assets/icons/ic-search.svg';
import './forward-modal.scss';

namespace ForwardModal {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
		messageIdsToForward: number[];
	}
}

const ForwardModal = ({ close, isDisplayed }: ForwardModal.Props) => {
	const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);
	const friends = useSelector((state: RootState) => state.friends.friends);

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

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			{isDisplayed && (
				<Modal
					title='Forward'
					closeModal={close}
					contents={
						<div className={'forward-modal'}>
							<div className='forward-modal__input-wrapper'>
								<input placeholder='   ' type='text' className='forward-modal__input' />
								<div className='forward-modal__input__placeholder'>
									<SearchSvg className={'forward-modal__input__svg'} viewBox='0 0 25 25' />
									<span>Search</span>
								</div>
							</div>
							<div className='forward-modal__chats-block'>
								{friends.map((friend) => {
									return (
										<div
											onClick={() => changeSelectedState(friend.id)}
											className='forward-modal__chat'
											key={friend.id}
										>
											<div className='forward-modal__selected-holder'>
												{isSelected(friend.id) ? <SelectedSvg /> : <UnSelectedSvg />}
											</div>
											<Avatar className={'forward-modal__avatar'} src={friend.avatarUrl}>
												{getUserInitials(friend)}
											</Avatar>
											<span className='forward-modal__friend-name'>{`${friend.firstName} ${friend.lastName}`}</span>
										</div>
									);
								})}
							</div>
						</div>
					}
					buttons={[]}
				/>
			)}
		</WithBackground>
	);
};

export default ForwardModal;
