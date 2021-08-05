import React, { lazy, useCallback, useRef, useState } from 'react';

import { IGroupChat, IAvatar } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LabeledInput } from '@components/labeled-input';
import { Modal } from '@components/modal';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { loadPhotoEditor } from '@routing/module-loader';
import { Button } from '@shared-components/button';
import { editGroupChatAction } from '@store/chats/actions';
import { IEditGroupChatActionPayload } from '@store/chats/features/edit-group-chat/action-payloads/edit-group-chat-action-payload';
import { getSelectedGroupChatSelector } from '@store/chats/selectors';
import { IAvatarSelectedData } from '@store/common/models';
import {
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
} from '@store/my-profile/actions';

import './edit-chat-modal.scss';

const BLOCK_NAME = 'edit-chat-modal';

const PhotoEditor = lazy(loadPhotoEditor);

export interface IEditChatModalProps {
  onClose: () => void;
}

const EditChatModal: React.FC<IEditChatModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const selectedGroupChat: IGroupChat | undefined = useSelector(
    getSelectedGroupChatSelector,
    () => true,
  );

  const uploadGroupChatAvatar = useActionWithDeferred(uploadAvatarRequestAction);
  const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);
  const editGroupChat = useActionWithDeferred(editGroupChatAction);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newName, setNewName] = useState(selectedGroupChat?.name);
  const [avatarData, setAvatarData] = useState<IAvatar | undefined>(selectedGroupChat?.avatar);
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
        setAvatarData(undefined);
        setAvatarData(undefined);
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

  const changeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value),
    [],
  );
  const changeDescription = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value),
    [],
  );

  const hideChangePhoto = useCallback(() => setImageUrl(null), []);

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
    setAvatarData(undefined);
  }, [cancelAvatarUploading]);

  return (
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>{t('editChatModal.title')}</Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__current-photo-wrapper`}>
            <GroupSvg viewBox="0 0 24 24" className={`${BLOCK_NAME}__current-photo-wrapper__alt`} />
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
                className={`${BLOCK_NAME}__current-photo-wrapper__img`}
              />
            )}
            <button
              type="button"
              onClick={() => {
                discardNewAvatar();
                fileInputRef.current?.click();
              }}
              className={`${BLOCK_NAME}__change-photo-btn`}>
              <PictureSvg viewBox="0 0 18 19" />
              <span>{t('editChatModal.upload_new')}</span>
            </button>
            <TopAvatarLine
              className={`${BLOCK_NAME}__current-photo-wrapper__top-line`}
              viewBox="0 0 48 48"
            />
            <BottomAvatarLine
              className={`${BLOCK_NAME}__current-photo-wrapper__bottom-line`}
              viewBox="0 0 114 114"
            />
          </div>
          <div className={`${BLOCK_NAME}__criteria`}>{t('editChatModal.requirements')}</div>

          <LabeledInput
            label={t('editChatModal.name')}
            value={newName}
            onChange={changeName}
            containerClassName={`${BLOCK_NAME}__input`}
          />

          <LabeledInput
            label={t('editChatModal.description')}
            value={newDescription}
            onChange={changeDescription}
            containerClassName={`${BLOCK_NAME}__input`}
          />
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button
              type="button"
              onClick={onClose}
              className={`${BLOCK_NAME}__btn edit-chat-modal__btn--cancel`}>
              {t('editChatModal.cancel')}
            </button>
            <Button
              disabled={newName?.length === 0}
              type="button"
              loading={submitLoading}
              onClick={onSubmit}
              className={`${BLOCK_NAME}__btn edit-chat-modal__btn--confirm`}>
              {t('editChatModal.save')}
            </Button>
          </div>
        </div>
        {imageUrl && (
          <PhotoEditor
            hideChangePhoto={hideChangePhoto}
            imageUrl={imageUrl}
            onSubmit={applyAvatarData}
          />
        )}
      </>
    </Modal>
  );
};

EditChatModal.displayName = 'EditChatModal';

export { EditChatModal };
