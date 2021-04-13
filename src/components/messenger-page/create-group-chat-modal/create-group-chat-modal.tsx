import { useTranslation } from 'react-i18next';
import { PhotoEditor, SearchBox, InfiniteScroll } from '@components/messenger-page';
import { Modal, WithBackground, LabeledInput, Button } from '@components/shared';
import { getFriendsAction, resetSearchFriendsAction } from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { createGroupChatAction } from '@store/chats/actions';
import { IChat } from '@store/chats/models';
import { useHistory } from 'react-router';
import {
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
} from '@store/my-profile/actions';
import { getMyFriendsListSelector, getMySearchFriendsListSelector } from '@store/friends/selectors';
import { myProfileSelector } from '@store/my-profile/selectors';
import { ICreateGroupChatActionPayload } from '@store/chats/features/create-group-chat/action-payloads/create-group-chat-action-payload';

import { IAvatar, IAvatarSelectedData, IPage, IUser } from '@store/common/models';
import { FRIENDS_LIMIT } from '@utils/pagination-limits';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { SelectEntity } from '../shared/select-entity/select-entity';
import './create-group-chat-modal.scss';

interface ICreateGroupChatProps {
  onClose: () => void;
  preSelectedUserIds?: number[];
}

enum GroupChatCreationStage {
  UserSelect = 'userSelect',
  GroupChatCreation = 'groupChatCreation',
}

export const CreateGroupChat: React.FC<ICreateGroupChatProps> = React.memo(
  ({ onClose, preSelectedUserIds }) => {
    const { t } = useTranslation();

    const currentUser = useSelector(myProfileSelector);
    const friendsList = useSelector(getMyFriendsListSelector);
    const searchFriendsList = useSelector(getMySearchFriendsListSelector);

    const { hasMore: hasMoreFriends, friends, loading: friendsLoading } = friendsList;
    const {
      hasMore: hasMoreSearchFriends,
      friends: searchFriends,
      loading: searchFriendsLoading,
    } = searchFriendsList;

    const history = useHistory();

    const uploadGroupChatAvatar = useActionWithDeferred(uploadAvatarRequestAction);
    const loadFriends = useActionWithDeferred(getFriendsAction);
    const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);
    const submitGroupChatCreation = useActionWithDeferred(createGroupChatAction);
    const resetSearchFriends = useActionWithDispatch(resetSearchFriendsAction);

    useEffect(
      () => () => {
        resetSearchFriends();
      },
      [resetSearchFriends],
    );

    const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds || []);
    const [currentStage, setCurrrentStage] = useState(GroupChatCreationStage.UserSelect);
    const [avatarData, setAvatarData] = useState<IAvatarSelectedData | null>(null);
    const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [uploaded, setUploaded] = useState(0);
    const [uploadEnded, setUploadEnded] = useState(true);
    const [creationLoading, setCreationLoading] = useState(false);

    const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

    const applyAvatarData = useCallback(
      async (data: IAvatarSelectedData) => {
        setAvatarData(data);
        setUploadEnded(false);
        try {
          const response = await uploadGroupChatAvatar({
            pathToFile: data.croppedImagePath,
            onProgress: setUploaded,
          });
          setAvatarUploadResponse(response);
          setUploadEnded(true);
        } catch {
          setAvatarData(null);
          setAvatarUploadResponse(null);
          setUploadEnded(true);
        }
      },
      [setAvatarData, setUploaded, uploadGroupChatAvatar, setAvatarUploadResponse],
    );

    const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [
      setChangePhotoDisplayed,
    ]);
    const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [
      setChangePhotoDisplayed,
    ]);

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

    const loadMore = useCallback(() => {
      const page: IPage = {
        offset: name.length ? searchFriends.length : friends.length,
        limit: FRIENDS_LIMIT,
      };
      loadFriends({ page, name, initializedByScroll: true });
    }, [searchFriends.length, friends.length, loadFriends, name]);

    const queryFriends = useCallback(
      (searchName: string) => {
        setName(searchName);
        loadFriends({
          page: { offset: 0, limit: FRIENDS_LIMIT },
          name: searchName,
          initializedByScroll: false,
        });
      },
      [loadFriends, setName],
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const reader = new FileReader();

        reader.onload = () => {
          setImageUrl(reader.result as string);
          displayChangePhoto();
        };

        if (e.target.files) {
          reader.readAsDataURL(e.target.files[0]);
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      [displayChangePhoto, setImageUrl, fileInputRef],
    );

    const discardAvatar = useCallback(() => {
      cancelAvatarUploading();
      setAvatarData(null);
      setAvatarUploadResponse(null);
      setUploadEnded(true);
    }, [cancelAvatarUploading]);

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
      setCurrrentStage(GroupChatCreationStage.GroupChatCreation);
    }, [setCurrrentStage]);

    const handleSearchInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => queryFriends(e.target.value),
      [queryFriends],
    );

    const renderSelectEntity = useCallback(
      (friend: IUser) => (
        <SelectEntity
          key={friend.id}
          chatOrUser={friend}
          isSelected={isSelected(friend.id)}
          changeSelectedState={changeSelectedState}
        />
      ),
      [changeSelectedState, isSelected],
    );

    const selectEntities = useMemo(() => {
      if (name.length) {
        return searchFriends.map(renderSelectEntity);
      }
      return friends.map(renderSelectEntity);
    }, [name.length, searchFriends, friends, renderSelectEntity]);

    return (
      <>
        <WithBackground onBackgroundClick={onClose}>
          <Modal
            title={
              currentStage === GroupChatCreationStage.UserSelect ? (
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
                {currentStage === GroupChatCreationStage.UserSelect && (
                  <div className="create-group-chat__select-friends">
                    <SearchBox
                      containerClassName="create-group-chat__select-friends__search"
                      onChange={handleSearchInputChange}
                    />
                    <InfiniteScroll
                      className="create-group-chat__friends-block"
                      onReachExtreme={loadMore}
                      hasMore={name.length ? hasMoreSearchFriends : hasMoreFriends}
                      isLoading={name.length ? searchFriendsLoading : friendsLoading}>
                      {selectEntities}
                    </InfiniteScroll>
                  </div>
                )}

                {currentStage === GroupChatCreationStage.GroupChatCreation && (
                  <div className="create-group-chat">
                    <div hidden> {uploaded}</div>
                    <div className="create-group-chat__current-photo-wrapper">
                      <GroupSvg
                        viewBox="0 0 24 24"
                        className="create-group-chat__current-photo-wrapper__alt"
                      />
                      <input
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*"
                      />
                      {avatarData?.croppedImagePath && (
                        <img
                          src={avatarData?.croppedImagePath}
                          alt=""
                          className="create-group-chat__current-photo-wrapper__img"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          discardAvatar();
                          fileInputRef.current?.click();
                        }}
                        className="create-group-chat__change-photo-btn">
                        <PictureSvg viewBox="0 0 18 19" />
                        <span>Upload New Photo</span>
                      </button>
                      <TopAvatarLine
                        className="create-group-chat__current-photo-wrapper__top-line"
                        viewBox="0 0 48 48"
                      />
                      <BottomAvatarLine
                        className="create-group-chat__current-photo-wrapper__bottom-line"
                        viewBox="0 0 114 114"
                      />
                    </div>
                    <div className="create-group-chat__criteria">
                      At least 256*256px PNG or JPG{' '}
                    </div>

                    <LabeledInput
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      containerClassName="create-group-chat__input"
                    />

                    <LabeledInput
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      containerClassName="create-group-chat__input"
                    />
                  </div>
                )}
              </>
            }
            buttons={[
              <button
                key={1}
                disabled={selectedUserIds.length === 0}
                type="button"
                className="create-group-chat__btn create-group-chat__btn--cancel"
                onClick={onClose}>
                {t('createGroupChatModal.cancel')}
              </button>,
              currentStage === GroupChatCreationStage.UserSelect ? (
                <button
                  key={2}
                  disabled={selectedUserIds.length === 0}
                  type="button"
                  className="create-group-chat__btn create-group-chat__btn--confirm"
                  onClick={goToGroupChatCreationStage}>
                  {t('createGroupChatModal.next')}
                </button>
              ) : null,
              currentStage === GroupChatCreationStage.GroupChatCreation ? (
                <Button
                  key={3}
                  disabled={!name.length || !uploadEnded}
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
        {changePhotoDisplayed && (
          <PhotoEditor
            hideChangePhoto={hideChangePhoto}
            imageUrl={imageUrl}
            onSubmit={applyAvatarData}
          />
        )}
      </>
    );
  },
);
