import { LocalizationContext } from '@contexts';
import { PhotoEditor, SearchBox, InfiniteScroll } from '@components/messenger-page';
import { Modal, WithBackground, LabeledInput } from '@components/shared';
import * as FriendActions from '@store/friends/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import * as ChatActions from '@store/chats/actions';
import { IChat } from '@store/chats/models';
import { useHistory } from 'react-router';
import * as MyProfileActions from '@store/my-profile/actions';
import {
  getFriendsLoadingSelector,
  getHasMoreFriendsSelector,
  getMyFriendsSelector,
} from '@store/friends/selectors';
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
    const { t } = useContext(LocalizationContext);

    const currentUser = useSelector(myProfileSelector);
    const friends = useSelector(getMyFriendsSelector);
    const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
    const friendsLoading = useSelector(getFriendsLoadingSelector);

    const history = useHistory();

    const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
    const loadFriends = useActionWithDeferred(FriendActions.getFriends);
    const cancelAvatarUploading = useActionWithDispatch(
      MyProfileActions.cancelAvatarUploadingRequestAction,
    );
    const submitGroupChatCreation = useActionWithDeferred(ChatActions.createGroupChat);

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

    const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

    const applyAvatarData = useCallback(
      (data: IAvatarSelectedData) => {
        setAvatarData(data);
        setUploadEnded(false);
        uploadGroupChatAvatar({ pathToFile: data.croppedImagePath, onProgress: setUploaded })
          .then((response) => {
            setAvatarUploadResponse(response);
            setUploadEnded(true);
          })
          .catch(() => {
            setAvatarData(null);
            setAvatarUploadResponse(null);
            setUploadEnded(true);
          });
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
        offset: friends.length,
        limit: FRIENDS_LIMIT,
      };
      loadFriends({ page });
    }, [friends, loadFriends]);

    const searchFriends = useCallback(
      (friendName: string) => {
        loadFriends({
          page: { offset: 0, limit: FRIENDS_LIMIT },
          name: friendName,
          initializedBySearch: true,
        });
      },
      [loadFriends],
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
      const groupChatToCreate: ICreateGroupChatActionPayload = {
        name,
        currentUser: currentUser as IUser,
        userIds: selectedUserIds,
        description,
        avatar: avararUploadResponse,
      };

      submitGroupChatCreation(groupChatToCreate).then((payload: IChat) => {
        history.push(`/chats/${payload.id}`);
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
                      onChange={(e) => searchFriends(e.target.value)}
                    />
                    <InfiniteScroll
                      className="create-group-chat__friends-block"
                      onReachExtreme={loadMore}
                      hasMore={hasMoreFriends}
                      isLoading={friendsLoading}>
                      {friends.map((friend) => (
                        <SelectEntity
                          key={friend.id}
                          chatOrUser={friend}
                          isSelected={isSelected(friend.id)}
                          changeSelectedState={changeSelectedState}
                        />
                      ))}
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
                <button
                  key={3}
                  disabled={name.length === 0 || !uploadEnded}
                  type="button"
                  className="create-group-chat__btn create-group-chat__btn--confirm"
                  onClick={onSubmit}>
                  {t('createGroupChatModal.create_groupChat')}
                </button>
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
