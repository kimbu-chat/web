import { useTranslation } from 'react-i18next';
import { Modal, WithBackground, Button } from '@components/shared';
import { resetSearchFriendsAction } from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { createGroupChatAction } from '@store/chats/actions';
import { IChat } from '@store/chats/models';
import { useHistory } from 'react-router';
import { myProfileSelector } from '@store/my-profile/selectors';
import { ICreateGroupChatActionPayload } from '@store/chats/features/create-group-chat/action-payloads/create-group-chat-action-payload';

import { IAvatar, IUser } from '@store/common/models';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { xor } from 'lodash';
import './create-group-chat-modal.scss';
import { UserSelect } from './user-select/user-select';
import { GroupChatCreation } from './group-chat-creation/group-chat-creation';

interface ICreateGroupChatProps {
  onClose: () => void;
  preSelectedUserIds?: number[];
}

enum GroupChatCreationStage {
  UserSelecting = 'userSelecting',
  GroupChatCreating = 'groupChatCreating',
}

const CreateGroupChat: React.FC<ICreateGroupChatProps> = React.memo(
  ({ onClose, preSelectedUserIds }) => {
    const { t } = useTranslation();

    const currentUser = useSelector(myProfileSelector);

    const history = useHistory();
    const submitGroupChatCreation = useActionWithDeferred(createGroupChatAction);
    const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

    useEffect(
      () => () => {
        resetSearchFriends();
      },
      [resetSearchFriends],
    );

    const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds || []);
    const [currentStage, setCurrrentStage] = useState(GroupChatCreationStage.UserSelecting);
    const [creationLoading, setCreationLoading] = useState(false);
    const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar | null>(null);
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
      setCreationLoading(true);
      const groupChatToCreate: ICreateGroupChatActionPayload = {
        name,
        currentUser: currentUser as IUser,
        userIds: selectedUserIds,
        description,
        avatar: avararUploadResponse,
      };

      submitGroupChatCreation(groupChatToCreate).then((payload: IChat) => {
        history.push(`/chats/${payload.id}`);
        setCreationLoading(false);
        onClose();
      });
    }, [
      avararUploadResponse,
      currentUser,
      description,
      history,
      name,
      onClose,
      selectedUserIds,
      submitGroupChatCreation,
    ]);

    const goToGroupChatCreationStage = useCallback(() => {
      setCurrrentStage(GroupChatCreationStage.GroupChatCreating);
    }, [setCurrrentStage]);

    return (
      <>
        <WithBackground onBackgroundClick={onClose}>
          <Modal
            title={
              currentStage === GroupChatCreationStage.UserSelecting ? (
                <>
                  <GroupSvg viewBox="0 0 24 24" className="create-group-chat__icon" />
                  <span>{t('createGroupChatModal.add_members')}</span>
                </>
              ) : (
                <>
                  <GroupSvg viewBox="0 0 24 24" className="create-group-chat__icon" />
                  <span>{t('createGroupChatModal.new_group')}</span>
                </>
              )
            }
            closeModal={onClose}
            content={
              <>
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
              </>
            }
            buttons={[
              <button
                key={1}
                type="button"
                className="create-group-chat__btn create-group-chat__btn--cancel"
                onClick={onClose}>
                {t('createGroupChatModal.cancel')}
              </button>,
              currentStage === GroupChatCreationStage.UserSelecting ? (
                <button
                  key={2}
                  disabled={selectedUserIds.length === 0}
                  type="button"
                  className="create-group-chat__btn create-group-chat__btn--confirm"
                  onClick={goToGroupChatCreationStage}>
                  {t('createGroupChatModal.next')}
                </button>
              ) : null,
              currentStage === GroupChatCreationStage.GroupChatCreating ? (
                <Button
                  key={3}
                  disabled={!name.length}
                  loading={creationLoading}
                  type="button"
                  className="create-group-chat__btn create-group-chat__btn--confirm"
                  onClick={onSubmit}>
                  {t('createGroupChatModal.create_groupChat')}
                </Button>
              ) : null,
            ]}
          />
        </WithBackground>
      </>
    );
  },
  (prevProps, nextProps) => {
    const result = xor(prevProps.preSelectedUserIds, nextProps.preSelectedUserIds).length === 0;

    return result;
  },
);

CreateGroupChat.displayName = 'CreateGroupChat';

export { CreateGroupChat };
