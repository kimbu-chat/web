import React, { useCallback, useRef, useState } from 'react';
import './edit-chat-modal.scss';

import { Modal, WithBackground, PhotoEditor, Avatar, CircularProgress } from 'components';

import CloseSVG from 'icons/ic-close.svg';

import { IGroupChat } from 'store/chats/models';
import { getSelectedGroupChatSelector } from 'store/chats/selectors';
import { useSelector } from 'react-redux';
import { getStringInitials } from 'app/utils/interlocutor-name-utils';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { IEditGroupChatActionPayload } from 'app/store/chats/features/edit-group-chat/action-payloads/edit-group-chat-action-payload';
import { IAvatar, IAvatarSelectedData } from 'app/store/common/models';

export interface IEditChatModalProps {
  onClose: () => void;
}

export const EditChatModal: React.FC<IEditChatModalProps> = React.memo(({ onClose }) => {
  const selectedGroupChat: IGroupChat | undefined = useSelector(getSelectedGroupChatSelector);

  const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
  const cancelAvatarUploading = useActionWithDispatch(MyProfileActions.cancelAvatarUploadingRequestAction);
  const editGroupChat = useActionWithDispatch(ChatActions.editGroupChat);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newName, setNewName] = useState(selectedGroupChat?.name!);
  const [avatarData, setAvatarData] = useState<IAvatarSelectedData | null>(null);
  const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar | null>(selectedGroupChat?.avatar || null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [newDescription, setNewDescription] = useState(selectedGroupChat?.description || '');
  const [uploaded, setUploaded] = useState(0);
  const [uploadEnded, setUploadEnded] = useState(true);

  const applyAvatarData = useCallback(
    (data: IAvatarSelectedData) => {
      setAvatarData(data);
      setUploadEnded(false);
      uploadGroupChatAvatar({ pathToFile: data.croppedImagePath, onProgress: setUploaded })
        .then((response: IAvatar) => {
          setAvatarUploadResponse(response);
          setUploadEnded(true);
        })
        .catch(() => {
          cancelAvatarUploading();
          setAvatarData({
            offsetY: 0,
            offsetX: 0,
            width: 0,
            imagePath: '',
            croppedImagePath: '',
          });
          setAvatarUploadResponse(null);
          setUploadEnded(true);
        });
    },
    [setAvatarData, setUploaded, uploadGroupChatAvatar, setAvatarUploadResponse],
  );

  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

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

  const onSubmit = useCallback(() => {
    onClose();

    const changes: IEditGroupChatActionPayload = {
      avatar: avararUploadResponse,
      name: newName,
      description: newDescription,
    };

    editGroupChat(changes);
  }, [avararUploadResponse, newName, newDescription]);

  const discardNewAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarData({
      offsetY: 0,
      offsetX: 0,
      width: 0,
      imagePath: '',
      croppedImagePath: '',
    });
    setAvatarUploadResponse(null);
    setUploadEnded(true);
  }, [setAvatarData, setAvatarUploadResponse, setUploadEnded]);

  return (
    <>
      <WithBackground onBackgroundClick={onClose}>
        <Modal
          title='Edit group'
          content={
            <div className='edit-chat-modal'>
              <div className='edit-chat-modal__change-photo'>
                <div className='edit-chat-modal__current-photo-wrapper'>
                  <Avatar
                    src={typeof avatarData?.croppedImagePath === 'string' ? avatarData?.croppedImagePath : selectedGroupChat?.avatar?.previewUrl}
                    className='edit-chat-modal__current-photo'
                  >
                    {getStringInitials(selectedGroupChat?.name)}
                  </Avatar>
                  {avatarData?.croppedImagePath && <CircularProgress progress={uploaded} />}

                  {avararUploadResponse && (
                    <button type='button' onClick={discardNewAvatar} className='edit-chat-modal__remove-photo'>
                      <CloseSVG viewBox='0 0 25 25' />
                    </button>
                  )}
                </div>
                <div className='edit-chat-modal__change-photo-data'>
                  <input onChange={handleImageChange} ref={fileInputRef} type='file' hidden accept='image/*' />
                  <button type='button' onClick={() => fileInputRef.current?.click()} className='edit-chat-modal__change-photo__btn'>
                    Upload New Photo
                  </button>
                  <span className='edit-chat-modal__change-photo__description'>At least 256 x 256px PNG or JPG file.</span>
                </div>
              </div>
              <div className='edit-chat-modal__name'>
                <span className='edit-chat-modal__name__label'>Name</span>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} type='text' className='edit-chat-modal__name__input' />
              </div>
              <div className='edit-chat-modal__description'>
                <span className='edit-chat-modal__description__label'>Description (optional)</span>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className='edit-chat-modal__description__input' />
              </div>
            </div>
          }
          closeModal={onClose}
          buttons={[
            <button type='button' onClick={onClose} className='edit-chat-modal__cancel-btn'>
              Cancel
            </button>,
            <button disabled={!uploadEnded} type='button' onClick={onSubmit} className='edit-chat-modal__confirm-btn'>
              Save
            </button>,
          ]}
        />
      </WithBackground>
      {changePhotoDisplayed && <PhotoEditor hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />}
    </>
  );
});
