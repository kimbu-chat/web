import React, { useCallback, useState, useEffect } from 'react';

import classNames from 'classnames';
import { IChat, IAvatar } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Modal, IModalChildrenProps } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { loadPhotoEditor } from '@routing/module-loader';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { AnimationMode } from '@shared-components/with-background/with-background';
import { createGroupChatAction } from '@store/chats/actions';
import { ICreateGroupChatActionPayload } from '@store/chats/features/create-group-chat/action-payloads/create-group-chat-action-payload';
import { resetSearchFriendsAction } from '@store/friends/actions';
import { myIdSelector } from '@store/my-profile/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import { GroupChatCreation } from './group-chat-creation/group-chat-creation';
import { UserSelect } from './user-select/user-select';

import './create-group-chat-modal.scss';

interface ICreateGroupChatModalProps {
  onClose: () => void;
  animationMode?: AnimationMode;
  preSelectedUserIds?: string[];
}

enum GroupChatCreationStage {
  UserSelecting = 'userSelecting',
  GroupChatCreating = 'groupChatCreating',
}

const BLOCK_NAME = 'create-group-chat';

const InitialCreateGroupChatModal: React.FC<ICreateGroupChatModalProps & IModalChildrenProps> = ({
  animatedClose,
  preSelectedUserIds,
}) => {
  const { t } = useTranslation();

  const currentUserId = useSelector(myIdSelector);

  const history = useHistory();
  const submitGroupChatCreation = useActionWithDeferred(createGroupChatAction);
  const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

  useEffect(() => {
    loadPhotoEditor();
  }, []);

  useEffect(
    () => () => {
      resetSearchFriends();
    },
    [resetSearchFriends],
  );

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(preSelectedUserIds || []);
  const [currentStage, setCurrrentStage] = useState(GroupChatCreationStage.UserSelecting);
  const [creationLoading, setCreationLoading] = useState(false);
  const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isSelected = useCallback((id: string) => selectedUserIds.includes(id), [selectedUserIds]);

  const changeSelectedState = useCallback(
    (id: string) => {
      if (selectedUserIds.includes(id)) {
        setSelectedUserIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
      } else {
        setSelectedUserIds((oldChatIds) => [...oldChatIds, id]);
      }
    },
    [selectedUserIds],
  );

  const onSubmit = useCallback(() => {
    if (currentUserId) {
      setCreationLoading(true);
      const groupChatToCreate: ICreateGroupChatActionPayload = {
        name,
        currentUserId,
        userIds: selectedUserIds,
        description,
        avatar: avararUploadResponse,
      };

      submitGroupChatCreation(groupChatToCreate).then((payload: IChat) => {
        animatedClose();
        history.push(replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', payload.id]));
      });
    }
  }, [
    animatedClose,
    avararUploadResponse,
    currentUserId,
    description,
    history,
    name,
    selectedUserIds,
    submitGroupChatCreation,
  ]);

  const goToGroupChatCreationStage = useCallback(() => {
    setCurrrentStage(GroupChatCreationStage.GroupChatCreating);
  }, [setCurrrentStage]);

  return (
    <>
      <Modal.Header>
        {currentStage === GroupChatCreationStage.UserSelecting ? (
          <>
            <GroupSvg className={`${BLOCK_NAME}__icon`} />
            <span>{t('createGroupChatModal.add_members')}</span>
          </>
        ) : (
          <>
            <GroupSvg className={`${BLOCK_NAME}__icon`} />
            <span>{t('createGroupChatModal.new_group')}</span>
          </>
        )}
      </Modal.Header>
      {currentStage === GroupChatCreationStage.UserSelecting && (
        <UserSelect changeSelectedState={changeSelectedState} isSelected={isSelected} />
      )}

      {currentStage === GroupChatCreationStage.GroupChatCreating && (
        <GroupChatCreation
          setName={setName}
          setDescription={setDescription}
          setAvatarUploadResponse={setAvatarUploadResponse}
        />
      )}

      <div className={`${BLOCK_NAME}__btn-block`}>
        <button
          type="button"
          className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
          onClick={animatedClose}>
          {t('createGroupChatModal.cancel')}
        </button>
        {currentStage === GroupChatCreationStage.UserSelecting ? (
          <button
            disabled={selectedUserIds.length === 0}
            type="button"
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}
            onClick={goToGroupChatCreationStage}>
            {t('createGroupChatModal.next')}
          </button>
        ) : (
          <Button
            disabled={!name.length}
            loading={creationLoading}
            type="button"
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}
            onClick={onSubmit}>
            {t('createGroupChatModal.create_groupChat')}
          </Button>
        )}
      </div>
    </>
  );
};

const CreateGroupChatModal: React.FC<ICreateGroupChatModalProps> = ({
  onClose,
  animationMode,
  ...props
}) => (
  <Modal animationMode={animationMode} closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialCreateGroupChatModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

CreateGroupChatModal.displayName = 'CreateGroupChatModal';

export { CreateGroupChatModal };
