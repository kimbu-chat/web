import React, { useCallback, useState, useEffect } from 'react';

import classNames from 'classnames';
import { IChat, IAvatar } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Modal, IModalChildrenProps } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { loadPhotoEditor } from '@routing/module-loader';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { AnimationMode } from '@shared-components/with-background/with-background';
import { createGroupChatAction } from '@store/chats/actions';
import { ICreateGroupChatActionPayload } from '@store/chats/features/create-group-chat/create-group-chat';
import { resetSearchFriendsAction } from '@store/friends/actions';
import { myIdSelector } from '@store/my-profile/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import { GroupChatCreation } from './group-chat-creation/group-chat-creation';
import { UserSelect } from './user-select/user-select';

import './create-group-chat-modal.scss';

interface IInitialCreateGroupChatModalProps {
  preSelectedUserIds?: number[];
}

interface ICreateGroupChatModalProps {
  onClose: () => void;
  animationMode?: AnimationMode;
}

enum GroupChatCreationStage {
  UserSelecting = 'userSelecting',
  GroupChatCreating = 'groupChatCreating',
}

const BLOCK_NAME = 'create-group-chat';

const InitialCreateGroupChatModal: React.FC<
  IInitialCreateGroupChatModalProps & IModalChildrenProps
> = ({ animatedClose, preSelectedUserIds }) => {
  const { t } = useTranslation();

  const currentUserId = useSelector(myIdSelector);

  const navigate = useNavigate();
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

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds || []);
  const [currentStage, setCurrentStage] = useState(GroupChatCreationStage.UserSelecting);
  const [creationLoading, setCreationLoading] = useState(false);
  const [avatarUploadResponse, setAvatarUploadResponse] = useState<IAvatar>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

  const changeSelectedState = useCallback(
    (id: number) => {
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
        avatar: avatarUploadResponse,
      };

      submitGroupChatCreation<IChat>(groupChatToCreate).then((payload) => {
        animatedClose();
        navigate(replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, ['id?', payload?.id as number]));
      });
    }
  }, [
    animatedClose,
    avatarUploadResponse,
    currentUserId,
    description,
    navigate,
    name,
    selectedUserIds,
    submitGroupChatCreation,
  ]);

  const goToGroupChatCreationStage = useCallback(() => {
    setCurrentStage(GroupChatCreationStage.GroupChatCreating);
  }, [setCurrentStage]);

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

const CreateGroupChatModal: React.FC<
  ICreateGroupChatModalProps & IInitialCreateGroupChatModalProps
> = ({ onClose, animationMode, ...props }) => (
  <Modal animationMode={animationMode} closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialCreateGroupChatModal {...props} animatedClose={animatedClose} />
    )}
  </Modal>
);

CreateGroupChatModal.displayName = 'CreateGroupChatModal';

export { CreateGroupChatModal };
