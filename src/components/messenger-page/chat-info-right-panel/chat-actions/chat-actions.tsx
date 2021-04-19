import React, { useCallback, useState } from 'react';
import './chat-actions.scss';
import { IChat } from '@store/chats/models';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from '@store/chats/selectors';

import { useTranslation } from 'react-i18next';
import { changeChatMutedStatusAction } from '@store/chats/actions';

import { ReactComponent as MuteSvg } from '@icons/mute.svg';
import { ReactComponent as UnmuteSvg } from '@icons/unmute.svg';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';

import { ReactComponent as DeleteSvg } from '@icons/delete-contact.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';
import { FadeAnimationWrapper, Button } from '@components/shared';
import { deleteFriendAction, addFriendAction } from '@store/friends/actions';
import { CreateGroupChat, GroupChatAddFriendModal } from '@components/messenger-page';
import { useActionWithDeferred, useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { blockUserAction, unblockUserAction } from '@store/settings/actions';
import { LeaveChatModal } from './leave-chat-modal/leave-chat-modal';
import { ClearChatModal } from './clear-chat-modal/clear-chat-modal';
import { RemoveChatModal } from './remove-chat-modal/remove-chat-modal';

export const ChatActions: React.FC = React.memo(() => {
  const { t } = useTranslation();

  const [addFriendsModalDisplayed, setAddFriendsModalDisplayed] = useState(false);
  const changeSetAddFriendsModalDisplayedState = useCallback(() => {
    setAddFriendsModalDisplayed((oldState) => !oldState);
  }, [setAddFriendsModalDisplayed]);

  const [leaveGroupChatModalOpened, setLeaveGroupChatModalOpened] = useState<boolean>(false);
  const changeLeaveGroupChatModalOpenedState = useCallback(
    () => setLeaveGroupChatModalOpened((oldState) => !oldState),
    [setLeaveGroupChatModalOpened],
  );

  const [clearChatModalOpened, setClearChatModalOpened] = useState<boolean>(false);
  const changeClearChatModalOpenedState = useCallback(
    () => setClearChatModalOpened((oldState) => !oldState),
    [setClearChatModalOpened],
  );

  const [createGroupChatModalOpened, setCreateGroupChatModalOpened] = useState<boolean>(false);
  const changeCreateGroupChatModalOpenedState = useCallback(
    () => setCreateGroupChatModalOpened((oldState) => !oldState),
    [setCreateGroupChatModalOpened],
  );

  const [removeChatModalOpened, setRemoveChatModalOpened] = useState<boolean>(false);
  const changeRemoveChatModalOpenedState = useCallback(
    () => setRemoveChatModalOpened((oldState) => !oldState),
    [setRemoveChatModalOpened],
  );

  const changeChatMutedStatus = useEmptyActionWithDeferred(changeChatMutedStatusAction);
  const deleteFriend = useActionWithDeferred(deleteFriendAction);
  const addFriend = useActionWithDeferred(addFriendAction);
  const blockUser = useActionWithDeferred(blockUserAction);
  const unBlockUser = useActionWithDeferred(unblockUserAction);

  const selectedChat = useSelector(getSelectedChatSelector) as IChat;

  const [isMuting, setIsMuting] = useState(false);
  const muteUnmute = useCallback(() => {
    setIsMuting(true);
    changeChatMutedStatus().then(() => {
      setIsMuting(false);
    });
  }, [changeChatMutedStatus]);
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const deleteContact = useCallback(() => {
    if (selectedChat?.interlocutor?.id) {
      setIsDeletingContact(true);
      deleteFriend({ userIds: [selectedChat.interlocutor.id] }).then(() => {
        setIsDeletingContact(false);
      });
    }
  }, [deleteFriend, selectedChat?.interlocutor?.id]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const addContact = useCallback(() => {
    if (selectedChat.interlocutor) {
      setIsAddingContact(true);
      addFriend(selectedChat.interlocutor).then(() => {
        setIsAddingContact(false);
      });
    }
  }, [addFriend, selectedChat?.interlocutor]);
  const [isBlocking, setIsBlocking] = useState(false);
  const blockSelectedUser = useCallback(() => {
    if (selectedChat.interlocutor) {
      setIsBlocking(true);
      blockUser(selectedChat.interlocutor).then(() => {
        setIsBlocking(false);
      });
    }
  }, [blockUser, selectedChat?.interlocutor]);
  const [isUnBlocking, setIsUnBlocking] = useState(false);
  const unBlockSelectedUser = useCallback(() => {
    if (selectedChat.interlocutor?.id) {
      setIsUnBlocking(true);
      unBlockUser(selectedChat.interlocutor.id).then(() => {
        setIsUnBlocking(false);
      });
    }
  }, [unBlockUser, selectedChat?.interlocutor?.id]);

  return (
    <div className="chat-actions">
      <h3 className="chat-actions__title">{t('chatActions.actions')}</h3>

      <Button
        themed
        loading={isMuting}
        type="button"
        onClick={muteUnmute}
        className="chat-actions__action">
        {selectedChat.isMuted ? <UnmuteSvg /> : <MuteSvg />}
        <span className="chat-actions__action__name">
          {selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}
        </span>
      </Button>
      <Button
        themed
        onClick={changeClearChatModalOpenedState}
        type="button"
        className="chat-actions__action">
        <ClearSvg />
        <span className="chat-actions__action__name">{t('chatActions.clear-history')}</span>
      </Button>

      {selectedChat.interlocutor && (
        <Button
          themed
          type="button"
          onClick={changeRemoveChatModalOpenedState}
          className="chat-actions__action">
          <DeleteSvg />
          <span className="chat-actions__action__name">{t('chatActions.remove-chat')}</span>
        </Button>
      )}

      {selectedChat.interlocutor &&
        (selectedChat.isInContacts ? (
          <Button
            themed
            loading={isDeletingContact}
            type="button"
            onClick={deleteContact}
            className="chat-actions__action">
            <DeleteSvg />
            <span className="chat-actions__action__name">{t('chatActions.delete-contact')}</span>
          </Button>
        ) : (
          <Button
            themed
            loading={isAddingContact}
            type="button"
            onClick={addContact}
            className="chat-actions__action">
            <AddUsersSvg />
            <span className="chat-actions__action__name">{t('chatActions.add-contact')}</span>
          </Button>
        ))}

      {selectedChat.interlocutor &&
        (selectedChat.isBlockedByUser ? (
          <Button
            themed
            loading={isUnBlocking}
            type="button"
            onClick={unBlockSelectedUser}
            className="chat-actions__action">
            <DeleteSvg />
            <span className="chat-actions__action__name">{t('chatActions.unblock-user')}</span>
          </Button>
        ) : (
          <Button
            themed
            loading={isBlocking}
            type="button"
            onClick={blockSelectedUser}
            className="chat-actions__action">
            <DeleteSvg />
            <span className="chat-actions__action__name">{t('chatActions.block-user')}</span>
          </Button>
        ))}

      {selectedChat.interlocutor && selectedChat.isInContacts && (
        <Button
          themed
          type="button"
          onClick={changeCreateGroupChatModalOpenedState}
          className="chat-actions__action">
          <UnmuteSvg />
          <span className="chat-actions__action__name">{t('chatActions.create-group')}</span>
        </Button>
      )}

      {selectedChat.groupChat && (
        <Button
          themed
          type="button"
          onClick={changeSetAddFriendsModalDisplayedState}
          className="chat-actions__action">
          <AddUsersSvg />
          <span className="chat-actions__action__name">{t('chatActions.add-users')}</span>
        </Button>
      )}

      {selectedChat.groupChat && (
        <Button
          themed
          type="button"
          onClick={changeLeaveGroupChatModalOpenedState}
          className="chat-actions__action">
          <LeaveSvg />
          <span className="chat-actions__action__name">{t('chatActions.leave-chat')}</span>
        </Button>
      )}

      <FadeAnimationWrapper isDisplayed={leaveGroupChatModalOpened}>
        <LeaveChatModal hide={changeLeaveGroupChatModalOpenedState} />
      </FadeAnimationWrapper>
      {selectedChat.interlocutor && (
        <FadeAnimationWrapper isDisplayed={createGroupChatModalOpened}>
          <CreateGroupChat
            preSelectedUserIds={[selectedChat.interlocutor.id]}
            onClose={changeCreateGroupChatModalOpenedState}
          />
        </FadeAnimationWrapper>
      )}
      <FadeAnimationWrapper isDisplayed={clearChatModalOpened}>
        <ClearChatModal hide={changeClearChatModalOpenedState} />
      </FadeAnimationWrapper>
      <FadeAnimationWrapper isDisplayed={removeChatModalOpened}>
        <RemoveChatModal onClose={changeRemoveChatModalOpenedState} />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={addFriendsModalDisplayed}>
        <GroupChatAddFriendModal onClose={changeSetAddFriendsModalDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
