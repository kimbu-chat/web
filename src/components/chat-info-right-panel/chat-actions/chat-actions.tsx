import React, { useCallback, useState } from 'react';
import './chat-actions.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getInfoChatSelector } from '@store/chats/selectors';
import { changeChatMutedStatusAction } from '@store/chats/actions';
import { ReactComponent as MuteSvg } from '@icons/mute.svg';
import { ReactComponent as UnmuteSvg } from '@icons/unmute.svg';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { ReactComponent as DeleteSvg } from '@icons/remove-chat.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as BlockSvg } from '@icons/block.svg';
import { ReactComponent as UnBlockSvg } from '@icons/unblock.svg';
import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';
import { ReactComponent as DeleteContactSvg } from '@icons/delete-contact.svg';
import {
  FadeAnimationWrapper,
  Button,
  CreateGroupChat,
  GroupChatAddFriendModal,
} from '@components';
import { deleteFriendAction, addFriendAction } from '@store/friends/actions';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { blockUserAction, unblockUserAction } from '@store/settings/actions';

import { LeaveChatModal } from './leave-chat-modal/leave-chat-modal';
import { ClearChatModal } from './clear-chat-modal/clear-chat-modal';
import { RemoveChatModal } from './remove-chat-modal/remove-chat-modal';

export const ChatActions: React.FC = () => {
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

  const changeChatMutedStatus = useActionWithDeferred(changeChatMutedStatusAction);
  const deleteFriend = useActionWithDeferred(deleteFriendAction);
  const addFriend = useActionWithDeferred(addFriendAction);
  const blockUser = useActionWithDeferred(blockUserAction);
  const unBlockUser = useActionWithDeferred(unblockUserAction);

  const chat = useSelector(
    getInfoChatSelector,
    (prev, next) => prev === next || prev?.draftMessage !== next?.draftMessage,
  );

  const [isMuting, setIsMuting] = useState(false);
  const muteUnmute = useCallback(() => {
    if (chat?.id) {
      setIsMuting(true);
      changeChatMutedStatus(chat.id).then(() => {
        setIsMuting(false);
      });
    }
  }, [changeChatMutedStatus, chat?.id]);
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const deleteContact = useCallback(() => {
    if (chat?.interlocutorId) {
      setIsDeletingContact(true);
      deleteFriend(chat?.interlocutorId).then(() => {
        setIsDeletingContact(false);
      });
    }
  }, [deleteFriend, chat?.interlocutorId]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const addContact = useCallback(() => {
    if (chat?.interlocutorId) {
      setIsAddingContact(true);
      addFriend(chat?.interlocutorId).then(() => {
        setIsAddingContact(false);
      });
    }
  }, [addFriend, chat?.interlocutorId]);
  const [isBlocking, setIsBlocking] = useState(false);
  const blockSelectedUser = useCallback(() => {
    if (chat?.interlocutorId) {
      setIsBlocking(true);
      blockUser(chat?.interlocutorId).then(() => {
        setIsBlocking(false);
      });
    }
  }, [blockUser, chat?.interlocutorId]);
  const [isUnBlocking, setIsUnBlocking] = useState(false);
  const unBlockSelectedUser = useCallback(() => {
    if (chat?.interlocutorId) {
      setIsUnBlocking(true);
      unBlockUser(chat?.interlocutorId).then(() => {
        setIsUnBlocking(false);
      });
    }
  }, [unBlockUser, chat?.interlocutorId]);

  return (
    <div className="chat-actions">
      <h3 className="chat-actions__title">{t('chatActions.actions')}</h3>

      <Button
        themed
        loading={isMuting}
        type="button"
        onClick={muteUnmute}
        className="chat-actions__action">
        {chat?.isMuted ? <UnmuteSvg /> : <MuteSvg />}
        <span className="chat-actions__action__name">
          {chat?.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}
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

      {chat?.interlocutorId && (
        <Button
          themed
          type="button"
          onClick={changeRemoveChatModalOpenedState}
          className="chat-actions__action">
          <DeleteSvg />
          <span className="chat-actions__action__name">{t('chatActions.remove-chat')}</span>
        </Button>
      )}

      {chat?.interlocutorId &&
        (chat?.isInContacts ? (
          <Button
            themed
            loading={isDeletingContact}
            type="button"
            onClick={deleteContact}
            className="chat-actions__action">
            <DeleteContactSvg />
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

      {chat?.interlocutorId &&
        (chat?.isBlockedByUser ? (
          <Button
            themed
            loading={isUnBlocking}
            type="button"
            onClick={unBlockSelectedUser}
            className="chat-actions__action">
            <UnBlockSvg />
            <span className="chat-actions__action__name">{t('chatActions.unblock-user')}</span>
          </Button>
        ) : (
          <Button
            themed
            loading={isBlocking}
            type="button"
            onClick={blockSelectedUser}
            className="chat-actions__action">
            <BlockSvg />
            <span className="chat-actions__action__name">{t('chatActions.block-user')}</span>
          </Button>
        ))}

      {chat?.interlocutorId && chat?.isInContacts && (
        <Button
          themed
          type="button"
          onClick={changeCreateGroupChatModalOpenedState}
          className="chat-actions__action">
          <UnmuteSvg />
          <span className="chat-actions__action__name">{t('chatActions.create-group')}</span>
        </Button>
      )}

      {chat?.groupChat && (
        <Button
          themed
          type="button"
          onClick={changeSetAddFriendsModalDisplayedState}
          className="chat-actions__action">
          <AddUsersSvg />
          <span className="chat-actions__action__name">{t('chatActions.add-users')}</span>
        </Button>
      )}

      {chat?.groupChat && (
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
      {chat?.interlocutorId && (
        <FadeAnimationWrapper isDisplayed={createGroupChatModalOpened}>
          <CreateGroupChat
            preSelectedUserIds={[chat?.interlocutorId]}
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
};