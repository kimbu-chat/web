import React, { useCallback, useContext, useState } from 'react';
import './chat-actions.scss';
import { IChat } from '@store/chats/models';
import { useSelector } from 'react-redux';
import {
  getMemberIdsForSelectedGroupChatSelector,
  getSelectedChatSelector,
} from '@store/chats/selectors';
import { LocalizationContext } from '@contexts';
import * as SelectedChatActions from '@store/chats/actions';

import { ReactComponent as MuteSvg } from '@icons/mute.svg';
import { ReactComponent as UnmuteSvg } from '@icons/unmute.svg';
import { ReactComponent as ClearSvg } from '@icons/clear.svg';
import { ReactComponent as DeleteSvg } from '@icons/delete-contact.svg';
import { ReactComponent as LeaveSvg } from '@icons/leave.svg';
import { ReactComponent as AddUsersSvg } from '@icons/add-users.svg';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import * as FriendActions from '@store/friends/actions';
import { FadeAnimationWrapper } from '@components/shared';
import { CreateGroupChat } from '@components/messenger-page';
import { ReactComponent as PeopleSvg } from '@icons/ic-group.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { BlockUser } from '@store/settings/features/block-user/block-user';
import { UnblockUser } from '@store/settings/features/unblock-user/unblock-user';
import { DeleteChatModal } from './delete-chat-modal/delete-chat-modal';
import { ClearChatModal } from './clear-chat-modal/clear-chat-modal';

interface IChatActionsProps {
  addMembers: (params: { excludeIds: (number | undefined)[] }) => void;
}

export const ChatActions: React.FC<IChatActionsProps> = React.memo(({ addMembers }) => {
  const { t } = useContext(LocalizationContext);

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

  const changeChatMutedStatus = useActionWithDispatch(SelectedChatActions.changeChatMutedStatus);
  const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
  const addFriend = useActionWithDeferred(FriendActions.addFriend);
  const blockUser = useActionWithDeferred(BlockUser.action);
  const unBlockUser = useActionWithDeferred(UnblockUser.action);

  const membersIdsForGroupChat = useSelector(getMemberIdsForSelectedGroupChatSelector);
  const selectedChat = useSelector(getSelectedChatSelector) as IChat;

  const deleteContact = useCallback(() => {
    if (selectedChat?.interlocutor?.id) {
      deleteFriend({ userIds: [selectedChat.interlocutor.id] });
    }
  }, [deleteFriend, selectedChat?.interlocutor?.id]);
  const addContact = useCallback(() => {
    if (selectedChat.interlocutor) {
      addFriend(selectedChat.interlocutor);
    }
  }, [addFriend, selectedChat?.interlocutor]);
  const blockSelectedUser = useCallback(() => {
    if (selectedChat.interlocutor) {
      blockUser(selectedChat.interlocutor);
    }
  }, [blockUser, selectedChat?.interlocutor]);
  const unBlockSelectedUser = useCallback(() => {
    if (selectedChat.interlocutor?.id) {
      unBlockUser(selectedChat.interlocutor.id);
    }
  }, [unBlockUser, selectedChat?.interlocutor?.id]);

  return (
    <div className="chat-actions">
      <h3 className="chat-actions__title">{t('chatActions.actions')}</h3>

      <button type="button" onClick={changeChatMutedStatus} className="chat-actions__action">
        {selectedChat.isMuted ? <UnmuteSvg /> : <MuteSvg />}
        <span className="chat-actions__action__name">
          {selectedChat.isMuted ? t('chatActions.unmute') : t('chatActions.mute')}
        </span>
      </button>
      <button
        onClick={changeClearChatModalOpenedState}
        type="button"
        className="chat-actions__action">
        <ClearSvg />
        <span className="chat-actions__action__name">{t('chatActions.clear-history')}</span>
      </button>

      {selectedChat.interlocutor && selectedChat.isInContacts && (
        <button type="button" onClick={deleteContact} className="chat-actions__action">
          <DeleteSvg />
          <span className="chat-actions__action__name">{t('chatActions.delete-contact')}</span>
        </button>
      )}

      {selectedChat.isBlockedByUser ? (
        <button type="button" onClick={unBlockSelectedUser} className="chat-actions__action">
          <DeleteSvg />
          <span className="chat-actions__action__name">{t('chatActions.unblock-user')}</span>
        </button>
      ) : (
        <button type="button" onClick={blockSelectedUser} className="chat-actions__action">
          <DeleteSvg />
          <span className="chat-actions__action__name">{t('chatActions.block-user')}</span>
        </button>
      )}

      {selectedChat.interlocutor &&
        (selectedChat.isInContacts ? (
          <button
            type="button"
            onClick={changeCreateGroupChatModalOpenedState}
            className="chat-actions__action">
            <UnmuteSvg />
            <span className="chat-actions__action__name">{t('chatActions.create-group')}</span>
          </button>
        ) : (
          <button type="button" onClick={addContact} className="chat-actions__action">
            <PeopleSvg />
            <span className="chat-actions__action__name">{t('chatActions.add-contact')}</span>
          </button>
        ))}

      {selectedChat.groupChat && (
        <button
          type="button"
          onClick={() => addMembers({ excludeIds: membersIdsForGroupChat })}
          className="chat-actions__action">
          <AddUsersSvg />
          <span className="chat-actions__action__name">{t('chatActions.add-users')}</span>
        </button>
      )}

      {selectedChat.groupChat && (
        <button
          type="button"
          onClick={changeLeaveGroupChatModalOpenedState}
          className="chat-actions__action">
          <LeaveSvg />
          <span className="chat-actions__action__name">{t('chatActions.leave-chat')}</span>
        </button>
      )}

      <FadeAnimationWrapper isDisplayed={leaveGroupChatModalOpened}>
        <DeleteChatModal hide={changeLeaveGroupChatModalOpenedState} />
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
    </div>
  );
});
