import React, { useCallback, useContext, useState } from 'react';
import './chat-actions.scss';
import { UserPreview } from 'store/my-profile/models';
import { Chat } from 'store/chats/models';
import { useSelector } from 'react-redux';
import { getMembersForSelectedGroupChat, getSelectedChatSelector } from 'store/chats/selectors';
import { LocalizationContext } from 'app/app';
import { ChatActions as SelectedChatActions } from 'store/chats/actions';
import MuteSvg from 'icons/ic-notifications-on.svg';
import UnmuteSvg from 'icons/ic-notifications-off.svg';
import ClearSvg from 'icons/ic-clear.svg';
import EditSvg from 'icons/ic-edit.svg';
import DeleteSvg from 'icons/ic-delete.svg';
import LeaveSvg from 'icons/ic-leave-chat.svg';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { FriendActions } from 'store/friends/actions';
import { CreateGroupChat, FadeAnimationWrapper } from 'components';
import PeopleSvg from 'icons/ic-group.svg';
import { getMyFriends } from 'app/store/friends/selectors';
import { DeleteChatModal } from './delete-chat-modal/delete-chat-modal';
import { ClearChatModal } from './clear-chat-modal/clear-chat-modal';

namespace ChatActionsNS {
  export interface Props {
    addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
  }
}

export const ChatActions = React.memo(({ addMembers }: ChatActionsNS.Props) => {
  const { t } = useContext(LocalizationContext);

  const [leaveGroupChatModalOpened, setLeaveGroupChatModalOpened] = useState<boolean>(false);
  const changeLeaveGroupChatModalOpenedState = useCallback(() => setLeaveGroupChatModalOpened((oldState) => !oldState), [setLeaveGroupChatModalOpened]);

  const [clearChatModalOpened, setClearChatModalOpened] = useState<boolean>(false);
  const changeClearChatModalOpenedState = useCallback(() => setClearChatModalOpened((oldState) => !oldState), [setClearChatModalOpened]);

  const [createGroupChatModalOpened, setCreateGroupChatModalOpened] = useState<boolean>(false);
  const changeCreateGroupChatModalOpenedState = useCallback(() => setCreateGroupChatModalOpened((oldState) => !oldState), [setCreateGroupChatModalOpened]);

  const changeChatVisibilityState = useActionWithDispatch(SelectedChatActions.changeChatVisibilityState);
  const muteChat = useActionWithDispatch(SelectedChatActions.muteChat);
  const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
  const addFriend = useActionWithDispatch(FriendActions.addFriend);

  const membersForGroupChat = useSelector(getMembersForSelectedGroupChat);
  const membersIdsForGroupChat: (number | undefined)[] = membersForGroupChat?.map((user) => user?.id) || [];
  const selectedChat = useSelector(getSelectedChatSelector) as Chat;
  const friends = useSelector(getMyFriends);

  const selectedIsFriend = useCallback((): boolean => friends.findIndex((friend: UserPreview) => friend.id === selectedChat.interlocutor?.id) > -1, [
    friends,
    selectedChat.interlocutor?.id,
  ]);

  const changeSelectedChatVisibilityState = useCallback(() => changeChatVisibilityState(selectedChat), [changeChatVisibilityState, selectedChat]);
  const muteThisChat = useCallback(() => muteChat(selectedChat), [muteChat, selectedChat]);
  const deleteContact = useCallback(() => deleteFriend({ userIds: [selectedChat?.interlocutor?.id!] }), [deleteFriend, selectedChat?.interlocutor?.id]);
  const addContact = useCallback(() => addFriend(selectedChat.interlocutor!), [addFriend, selectedChat?.interlocutor]);

  return (
    <div className='chat-actions'>
      <div className='chat-actions__heading'>{t('chatActions.actions')}</div>
      <button type='button' onClick={muteThisChat} className='chat-actions__action'>
        {selectedChat.isMuted ? (
          <UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
        ) : (
          <MuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
        )}
        <span className='chat-actions__action__name'>{selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}</span>
      </button>
      <button onClick={changeClearChatModalOpenedState} type='button' className='chat-actions__action'>
        <ClearSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
        <span className='chat-actions__action__name'>{t('chatActions.clear-history')}</span>
      </button>
      {selectedChat.interlocutor && (
        <button type='button' className='chat-actions__action'>
          <EditSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.edit-contact')}</span>
        </button>
      )}
      {selectedChat.interlocutor && selectedIsFriend() && (
        <button type='button' onClick={deleteContact} className='chat-actions__action'>
          <DeleteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.delete-contact')}</span>
        </button>
      )}

      {selectedChat.interlocutor && !selectedIsFriend() && (
        <button type='button' onClick={addContact} className='chat-actions__action'>
          <PeopleSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.add-contact')}</span>
        </button>
      )}

      {selectedChat.interlocutor && selectedIsFriend() && (
        <button type='button' onClick={changeCreateGroupChatModalOpenedState} className='chat-actions__action'>
          <UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.create-group')}</span>
        </button>
      )}
      {selectedChat.interlocutor && (
        <button type='button' onClick={changeSelectedChatVisibilityState} className='chat-actions__action'>
          <UnmuteSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.delete-chat')}</span>
        </button>
      )}
      {selectedChat.groupChat && (
        <button type='button' onClick={changeLeaveGroupChatModalOpenedState} className='chat-actions__action'>
          <LeaveSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.leave-chat')}</span>
        </button>
      )}
      {selectedChat.groupChat && (
        <button type='button' onClick={() => addMembers({ excludeIds: membersIdsForGroupChat })} className='chat-actions__action'>
          <LeaveSvg viewBox='0 0 25 25' className='chat-actions__action__svg' />
          <span className='chat-actions__action__name'>{t('chatActions.add-users')}</span>
        </button>
      )}

      {
        //! Modal rendered with portal
      }
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
