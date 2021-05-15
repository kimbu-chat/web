import React, { lazy, useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { WithBackground } from '@components/with-background';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { LabeledInput } from '@components/labeled-input';
import { IGroupChat } from '@store/chats/models';
import { getSelectedGroupChatSelector } from '@store/chats/selectors';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import {
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
} from '@store/my-profile/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { IEditGroupChatActionPayload } from '@store/chats/features/edit-group-chat/action-payloads/edit-group-chat-action-payload';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { IAvatar, IAvatarSelectedData } from '@store/common/models';
import { loadPhotoEditor } from '@routing/module-loader';
import { editGroupChatAction } from '@store/chats/actions';

import './edit-chat-modal.scss';

const PhotoEditor = lazy(loadPhotoEditor);

export interface IEditChatModalProps {
  onClose: () => void;
}

const EditChatModal: React.FC<IEditChatModalProps> = ({ onClose }) => {
  const selectedGroupChat: IGroupChat | undefined = useSelector(
    getSelectedGroupChatSelector,
    () => true,
  );

  const uploadGroupChatAvatar = useActionWithDeferred(uploadAvatarRequestAction);
  const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);
  const editGroupChat = useActionWithDeferred(editGroupChatAction);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newName, setNewName] = useState(selectedGroupChat?.name);
  const [avatarData, setAvatarData] = useState<IAvatar | null>(selectedGroupChat?.avatar || null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState(selectedGroupChat?.description || '');

  const [submitLoading, setSubmitLoading] = useState(false);

  const applyAvatarData = useCallback(
    async (data: IAvatarSelectedData) => {
      try {
        const response = await uploadGroupChatAvatar({
          pathToFile: data.croppedImagePath,
        });
        setAvatarData(response);
      } catch {
        setAvatarData(null);
        setAvatarData(null);
      }
    },
    [setAvatarData, uploadGroupChatAvatar],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const reader = new FileReader();

      reader.onload = () => {
        setImageUrl(reader.result as string);
      };

      if (e.target.files) {
        reader.readAsDataURL(e.target.files[0]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setImageUrl, fileInputRef],
  );

  const onSubmit = useCallback(() => {
    const changes: IEditGroupChatActionPayload = {
      avatar: avatarData,
      name: newName as string,
      description: newDescription,
    };
    setSubmitLoading(true);
    editGroupChat(changes).then(() => {
      setSubmitLoading(false);
      onClose();
    });
  }, [onClose, avatarData, newName, newDescription, editGroupChat]);

  const discardNewAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarData(null);
  }, [cancelAvatarUploading]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title="Edit group"
        content={
          <>
            <div className="edit-chat-modal">
              <div className="edit-chat-modal__current-photo-wrapper">
                <GroupSvg
                  viewBox="0 0 24 24"
                  className="edit-chat-modal__current-photo-wrapper__alt"
                />
                <input
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                />
                {avatarData?.previewUrl && (
                  <img
                    src={avatarData.previewUrl}
                    alt=""
                    className="edit-chat-modal__current-photo-wrapper__img"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    discardNewAvatar();
                    fileInputRef.current?.click();
                  }}
                  className="edit-chat-modal__change-photo-btn">
                  <PictureSvg viewBox="0 0 18 19" />
                  <span>Upload New Photo</span>
                </button>
                <TopAvatarLine
                  className="edit-chat-modal__current-photo-wrapper__top-line"
                  viewBox="0 0 48 48"
                />
                <BottomAvatarLine
                  className="edit-chat-modal__current-photo-wrapper__bottom-line"
                  viewBox="0 0 114 114"
                />
              </div>
              <div className="edit-chat-modal__criteria">At least 256*256px PNG or JPG </div>

              <LabeledInput
                label="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                containerClassName="edit-chat-modal__input"
              />

              <LabeledInput
                label="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                containerClassName="edit-chat-modal__input"
              />
            </div>
            {imageUrl && (
              <PhotoEditor
                hideChangePhoto={() => setImageUrl(null)}
                imageUrl={imageUrl}
                onSubmit={applyAvatarData}
              />
            )}
          </>
        }
        closeModal={onClose}
        buttons={[
          <button
            key={1}
            type="button"
            onClick={onClose}
            className="edit-chat-modal__btn edit-chat-modal__btn--cancel">
            Cancel
          </button>,
          <Button
            key={2}
            disabled={newName?.length === 0}
            type="button"
            loading={submitLoading}
            onClick={onSubmit}
            className="edit-chat-modal__btn edit-chat-modal__btn--confirm">
            Save
          </Button>,
        ]}
      />
    </WithBackground>
  );
};

EditChatModal.displayName = 'EditChatModal';

export { EditChatModal };
