import React, { useCallback, useContext, useState } from 'react';
import './chat-actions.scss';
import { IUserPreview } from 'app/store/models';
import { IChat } from 'store/chats/models';
import { useSelector } from 'react-redux';
import { getMemberIdsForSelectedGroupChatSelector, getSelectedChatSelector } from 'store/chats/selectors';
import { LocalizationContext } from 'app/app';
import { ChatActions as SelectedChatActions } from 'store/chats/actions';
import MuteSvg from 'icons/mute.svg';
import UnmuteSvg from 'icons/ic-notifications-off.svg';
import ClearSvg from 'icons/time.svg';
import DeleteSvg from 'icons/trash-box.svg';
import LeaveSvg from 'icons/leave.svg';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { FriendActions } from 'store/friends/actions';
import { CreateGroupChat, FadeAnimationWrapper } from 'components';
import PeopleSvg from 'icons/ic-group.svg';
import { getMyFriendsSelector } from 'app/store/friends/selectors';
import { DeleteChatModal } from './delete-chat-modal/delete-chat-modal';
import { ClearChatModal } from './clear-chat-modal/clear-chat-modal';

interface IChatActionsProps {
  addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
}

export const ChatActions: React.FC<IChatActionsProps> = React.memo(({ addMembers }) => {
  const { t } = useContext(LocalizationContext);

  const [leaveGroupChatModalOpened, setLeaveGroupChatModalOpened] = useState<boolean>(false);
  const changeLeaveGroupChatModalOpenedState = useCallback(() => setLeaveGroupChatModalOpened((oldState) => !oldState), [setLeaveGroupChatModalOpened]);

  const [clearChatModalOpened, setClearChatModalOpened] = useState<boolean>(false);
  const changeClearChatModalOpenedState = useCallback(() => setClearChatModalOpened((oldState) => !oldState), [setClearChatModalOpened]);

  const [createGroupChatModalOpened, setCreateGroupChatModalOpened] = useState<boolean>(false);
  const changeCreateGroupChatModalOpenedState = useCallback(() => setCreateGroupChatModalOpened((oldState) => !oldState), [setCreateGroupChatModalOpened]);

  const changeChatMutedStatus = useActionWithDispatch(SelectedChatActions.changeChatMutedStatus);
  const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
  const addFriend = useActionWithDispatch(FriendActions.addFriend);

  const membersIdsForGroupChat = useSelector(getMemberIdsForSelectedGroupChatSelector);
  const selectedChat = useSelector(getSelectedChatSelector) as IChat;
  const friends = useSelector(getMyFriendsSelector);

  const selectedIsFriend = useCallback((): boolean => friends.findIndex((friend: IUserPreview) => friend.id === selectedChat.interlocutor?.id) > -1, [
    friends,
    selectedChat.interlocutor?.id,
  ]);
  const deleteContact = useCallback(() => deleteFriend({ userIds: [selectedChat?.interlocutor?.id!] }), [deleteFriend, selectedChat?.interlocutor?.id]);
  const addContact = useCallback(() => addFriend(selectedChat.interlocutor!), [addFriend, selectedChat?.interlocutor]);

  return (
    <div className='chat-actions'>
      <button type='button' onClick={changeChatMutedStatus} className='chat-actions__action'>
        {selectedChat.isMuted ? <UnmuteSvg /> : <MuteSvg />}
        <span className='chat-actions__action__name'>{selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}</span>
      </button>

      <button onClick={changeClearChatModalOpenedState} type='button' className='chat-actions__action'>
        <ClearSvg />
        <span className='chat-actions__action__name'>{t('chatActions.clear-history')}</span>
      </button>

      {selectedChat.interlocutor && selectedIsFriend() && (
        <button type='button' onClick={deleteContact} className='chat-actions__action'>
          <DeleteSvg />
          <span className='chat-actions__action__name'>{t('chatActions.delete-contact')}</span>
        </button>
      )}

      {selectedChat.interlocutor && !selectedIsFriend() && (
        <button type='button' onClick={addContact} className='chat-actions__action'>
          <PeopleSvg />
          <span className='chat-actions__action__name'>{t('chatActions.add-contact')}</span>
        </button>
      )}

      {selectedChat.interlocutor && selectedIsFriend() && (
        <button type='button' onClick={changeCreateGroupChatModalOpenedState} className='chat-actions__action'>
          <UnmuteSvg />
          <span className='chat-actions__action__name'>{t('chatActions.create-group')}</span>
        </button>
      )}

      {selectedChat.groupChat && (
        <button type='button' onClick={changeLeaveGroupChatModalOpenedState} className='chat-actions__action'>
          <LeaveSvg />
          <span className='chat-actions__action__name'>{t('chatActions.leave-chat')}</span>
        </button>
      )}
      {selectedChat.groupChat && (
        <button type='button' onClick={() => addMembers({ excludeIds: membersIdsForGroupChat })} className='chat-actions__action'>
          <LeaveSvg />
          <span className='chat-actions__action__name'>{t('chatActions.add-users')}</span>
        </button>
      )}

      <FadeAnimationWrapper isDisplayed={leaveGroupChatModalOpened}>
        <DeleteChatModal hide={changeLeaveGroupChatModalOpenedState} />
      </FadeAnimationWrapper>

      {selectedChat.interlocutor && (
        <FadeAnimationWrapper isDisplayed={createGroupChatModalOpened}>
          <CreateGroupChat preSelectedUserIds={[selectedChat.interlocutor!.id]} onClose={changeCreateGroupChatModalOpenedState} />
        </FadeAnimationWrapper>
      )}

      <FadeAnimationWrapper isDisplayed={clearChatModalOpened}>
        <ClearChatModal hide={changeClearChatModalOpenedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
