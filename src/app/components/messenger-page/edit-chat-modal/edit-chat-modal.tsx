import React, { useCallback, useRef, useState } from 'react';
import './edit-chat-modal.scss';

import { Modal, WithBackground, PhotoEditor } from 'components';

import { IGroupChat } from 'store/chats/models';
import { getSelectedGroupChatSelector } from 'store/chats/selectors';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { IEditGroupChatActionPayload } from 'app/store/chats/features/edit-group-chat/action-payloads/edit-group-chat-action-payload';
import GroupSvg from 'icons/group.svg';
import PictureSvg from 'icons/picture.svg';
import TopAvatarLine from 'icons/top-avatar-line.svg';
import BottomAvatarLine from 'icons/bottom-avatar-line.svg';
import { IAvatar, IAvatarSelectedData } from 'app/store/common/models';
import { ChatActions } from 'app/store/chats/actions';

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

  const imageToDisplay = typeof avatarData?.croppedImagePath === 'string' ? avatarData?.croppedImagePath : selectedGroupChat?.avatar?.previewUrl;

  return (
    <>
      <WithBackground onBackgroundClick={onClose}>
        <Modal
          title='Edit group'
          content={
            <div className='edit-chat-modal'>
              <div hidden> {uploaded}</div>
              <div className='edit-chat-modal__current-photo-wrapper'>
                <GroupSvg viewBox='0 0 24 24' className='edit-chat-modal__current-photo-wrapper__alt' />
                <input onChange={handleImageChange} ref={fileInputRef} type='file' hidden accept='image/*' />
                {imageToDisplay && <img src={imageToDisplay} alt='' className='edit-chat-modal__current-photo-wrapper__img' />}
                <button
                  type='button'
                  onClick={() => {
                    discardNewAvatar();
                    fileInputRef.current?.click();
                  }}
                  className='edit-chat-modal__change-photo-btn'
                >
                  <PictureSvg viewBox='0 0 18 19' />
                  <span>Upload New Photo</span>
                </button>
                <TopAvatarLine className='edit-chat-modal__current-photo-wrapper__top-line' viewBox='0 0 48 48' />
                <BottomAvatarLine className='edit-chat-modal__current-photo-wrapper__bottom-line' viewBox='0 0 114 114' />
              </div>
              <div className='edit-chat-modal__criteria'>At least 256*256px PNG or JPG </div>

              <div className='edit-chat-modal__input-group'>
                <span className='edit-chat-modal__input-label'>Name</span>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} type='text' className='edit-chat-modal__input' />
              </div>

              <div className='edit-chat-modal__input-group'>
                <span className='edit-chat-modal__input-label'>Description (optional)</span>
                <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} type='text' className='edit-chat-modal__input' />
              </div>
            </div>
          }
          closeModal={onClose}
          buttons={[
            <button key={1} type='button' onClick={onClose} className='create-group-chat__btn create-group-chat__btn--cancel'>
              Cancel
            </button>,
            <button key={2} disabled={!uploadEnded} type='button' onClick={onSubmit} className='create-group-chat__btn'>
              Save
            </button>,
          ]}
        />
      </WithBackground>
      {changePhotoDisplayed && <PhotoEditor hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />}
    </>
  );
});
