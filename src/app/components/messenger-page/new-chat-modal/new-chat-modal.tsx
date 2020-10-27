import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { RootState } from 'app/store/root-reducer';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import './new-chat-modal.scss';
import SearchBox from '../search-box/search-box';
import FriendFromList from '../shared/friend-from-list/friend-from-list';
import { FriendActions } from 'app/store/friends/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { MessageActions } from 'app/store/messages/actions';
import { UserPreview } from 'app/store/my-profile/models';
import { useHistory } from 'react-router';

import PeopleSvg from 'app/assets/icons/ic-group.svg';

namespace NewChatModal {
	export interface Props {
		onClose: () => void;
		displayCreateConference: () => void;
	}
}

const NewChatModal = ({ onClose, displayCreateConference }: NewChatModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const friends = useSelector((state: RootState) => state.friends.friends);

	const createChat = useActionWithDispatch(MessageActions.createChat);
	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const history = useHistory();

	const createEmptyChat = useCallback((user: UserPreview) => {
		createChat(user);
		const chatId = Number(`${user.id}1`);
		history.push(`/chats/${chatId}`);
		onClose();
	}, []);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	const createConference = useCallback(() => {
		displayCreateConference();
		onClose();
	}, [displayCreateConference]);

	return (
		<WithBackground onBackgroundClick={onClose}>
			<Modal
				title={t('newChat.new_message')}
				closeModal={onClose}
				contents={
					<div className={'new-chat'}>
						<SearchBox onChange={(e) => searchFriends(e.target.value)} />
						<div className='new-chat__friends-block'>
							<div onClick={createConference} className='new-chat__new-group'>
								<div className='new-chat__new-group__img'>
									<PeopleSvg viewBox='0 0 25 25' />
								</div>
								<span className='new-chat__new-group__title'>{t('newChat.new_group')}</span>
							</div>
							{friends.map((friend) => {
								return <FriendFromList key={friend.id} friend={friend} onClick={createEmptyChat} />;
							})}
						</div>
					</div>
				}
				buttons={[]}
			/>
		</WithBackground>
	);
};

export default NewChatModal;
