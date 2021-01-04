import { LocalizationContext } from 'app/app';
import { Avatar, Modal, WithBackground, ChangePhoto, FriendFromList, SearchBox, CircularProgress } from 'components';
import { FriendActions } from 'store/friends/actions';
import { IAvatarSelectedData, IUploadAvatarResponse } from 'store/my-profile/models';
import { getStringInitials } from 'app/utils/interlocutor-name-utils';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseSVG from 'icons/ic-close.svg';
import './create-group-chat-modal.scss';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { ChatActions } from 'store/chats/actions';
import { IChat } from 'store/chats/models';
import { useHistory } from 'react-router';
import { MyProfileActions } from 'store/my-profile/actions';
import { getFriendsLoading, getHasMoreFriends, getMyFriends } from 'app/store/friends/selectors';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { ICreateGroupChatActionPayload } from 'app/store/chats/features/create-group-chat/create-group-chat-action-payload';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { IPage } from 'app/store/common/models';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';

interface ICreateGroupChatProps {
  onClose: () => void;
  preSelectedUserIds?: number[];
}

enum GroupChatCreationStage {
  UserSelect = 'userSelect',
  GroupChatCreation = 'groupChatCreation',
}

export const CreateGroupChat: React.FC<ICreateGroupChatProps> = React.memo(({ onClose, preSelectedUserIds }) => {
  const { t } = useContext(LocalizationContext);

  const currentUser = useSelector(getMyProfileSelector);
  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);

  const history = useHistory();

  const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
  const loadFriends = useActionWithDeferred(FriendActions.getFriends);
  const cancelAvatarUploading = useActionWithDispatch(MyProfileActions.cancelAvatarUploadingRequestAction);
  const submitGroupChatCreation = useActionWithDeferred(ChatActions.createGroupChat);

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds || []);
  const [currentStage, setCurrrentStage] = useState(GroupChatCreationStage.UserSelect);
  const [avatarData, setAvatarData] = useState<IAvatarSelectedData | null>(null);
  const [avararUploadResponse, setAvatarUploadResponse] = useState<IUploadAvatarResponse | null>(null);
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

  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

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

  const searchFriends = useCallback((name: string) => {
    loadFriends({ page: { offset: 0, limit: FRIENDS_LIMIT }, name, initializedBySearch: true });
  }, []);

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
  }, [setAvatarData, setAvatarUploadResponse, setUploadEnded]);

  const onSubmit = useCallback(() => {
    const groupChatToCreate: ICreateGroupChatActionPayload = {
      name,
      currentUser: currentUser!,
      userIds: selectedUserIds,
      description,
      avatar: avararUploadResponse,
    };

    submitGroupChatCreation(groupChatToCreate).then((payload: IChat) => {
      history.push(`/chats/${payload.id}`);
      onClose();
    });
  }, [avararUploadResponse, description, name, onClose]);

  const goToGroupChatCreationStage = useCallback(() => {
    setCurrrentStage(GroupChatCreationStage.GroupChatCreation);
  }, [setCurrrentStage]);

  return (
    <>
      <WithBackground onBackgroundClick={onClose}>
        <Modal
          title={
            currentStage === GroupChatCreationStage.UserSelect ? (
              <div className='create-group-chat__heading'>
                <div className='create-group-chat__title'>{t('createGroupChatModal.add_members')}</div>
                <div className='create-group-chat__selected-count'>{`${selectedUserIds.length} / 1000`}</div>
              </div>
            ) : (
              t('createGroupChatModal.new_group')
            )
          }
          closeModal={onClose}
          contents={
            <>
              {currentStage === GroupChatCreationStage.UserSelect && (
                <div className='create-group-chat__select-friends'>
                  <SearchBox onChange={(e) => searchFriends(e.target.value)} />
                  <InfiniteScroll className='create-group-chat__friends-block' onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
                    {friends.map((friend) => (
                      <FriendFromList key={friend.id} friend={friend} isSelected={isSelected(friend.id)} changeSelectedState={changeSelectedState} />
                    ))}
                  </InfiniteScroll>
                </div>
              )}

              {currentStage === GroupChatCreationStage.GroupChatCreation && (
                <div className='create-group-chat'>
                  <div className='create-group-chat__change-photo'>
                    <div className='create-group-chat__current-photo-wrapper'>
                      <Avatar src={avatarData?.croppedImagePath} className='create-group-chat__current-photo'>
                        {getStringInitials(name)}
                      </Avatar>
                      {avatarData && (
                        <>
                          <CircularProgress progress={uploaded} />
                          <button type='button' onClick={discardAvatar} className='create-group-chat__remove-photo'>
                            <CloseSVG viewBox='0 0 25 25' />
                          </button>
                        </>
                      )}
                    </div>
                    <div className='create-group-chat__change-photo-data'>
                      <input onChange={handleImageChange} ref={fileInputRef} type='file' hidden accept='image/*' />
                      <button type='button' onClick={() => fileInputRef.current?.click()} className='create-group-chat__change-photo__btn'>
                        Upload New Photo
                      </button>
                      <span className='create-group-chat__change-photo__description'>At least 256 x 256px PNG or JPG file.</span>
                    </div>
                  </div>
                  <div className='create-group-chat__name'>
                    <span className='create-group-chat__name__label'>Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} type='text' className='create-group-chat__name__input' />
                  </div>
                  <div className='create-group-chat__description'>
                    <span className='create-group-chat__description__label'>Description (optional)</span>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='create-group-chat__description__input' />
                  </div>
                </div>
              )}
            </>
          }
          buttons={[
            {
              children: t('createGroupChatModal.next'),
              style: {
                display: currentStage === GroupChatCreationStage.UserSelect ? 'block' : 'none',
              },
              position: 'left',
              disabled: selectedUserIds.length === 0,
              onClick: goToGroupChatCreationStage,
              width: 'contained',
              variant: 'contained',
              color: 'primary',
            },
            {
              children: t('createGroupChatModal.create_groupChat'),
              style: {
                display: currentStage === GroupChatCreationStage.GroupChatCreation ? 'block' : 'none',
              },
              disabled: name.length === 0 || !uploadEnded,
              position: 'left',
              onClick: onSubmit,
              width: 'contained',
              variant: 'contained',
              color: 'primary',
            },
          ]}
        />
      </WithBackground>
      {changePhotoDisplayed && <ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />}
    </>
  );
});
