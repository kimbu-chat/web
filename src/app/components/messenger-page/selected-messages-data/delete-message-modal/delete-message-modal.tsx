import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import CheckBoxSvg from 'icons/ic-checkbox.svg';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import './delete-message-modal.scss';
import { DeleteMessage } from 'app/store/chats/features/delete-message/delete-message';
import { getSelectedChatInterlocutorNameSelector } from 'app/store/chats/selectors';

interface IDeleteMessageModalProps {
  onClose: () => void;
  selectedMessages: number[];
}

export const DeleteMessageModal: React.FC<IDeleteMessageModalProps> = React.memo(({ onClose, selectedMessages }) => {
  const { t } = useContext(LocalizationContext);

  const deleteMessage = useActionWithDispatch(DeleteMessage.action);

  const [deleteForInterlocutor, setDeleteForInterlocutor] = useState(false);
  const changeDeleteForInterlocutorState = useCallback(() => {
    setDeleteForInterlocutor((oldState) => !oldState);
  }, [setDeleteForInterlocutor]);

  const selectedChatInterlocutorName = useSelector(getSelectedChatInterlocutorNameSelector);

  const deleteTheseMessages = useCallback(() => {
    deleteMessage({ messageIds: selectedMessages, forEveryone: deleteForInterlocutor });
    onClose();
  }, [selectedMessages, deleteForInterlocutor]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title='Delete message'
        content={
          <div>
            <div className=''>
              {t('deleteMessageModal.delete-confirmation', { count: selectedMessages.length })
                .split(`${selectedMessages.length}`)
                .map((text, index, arr) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={index}>
                    <span className='modal__contents__text'>{text}</span>
                    {index < arr.length - 1 && <span className='modal__contents__text modal__contents__text--highlighted'>{selectedMessages.length}</span>}
                  </React.Fragment>
                ))}
            </div>
            <div className='delete-message-modal'>
              <button type='button' className='delete-message-modal__btn' onClick={changeDeleteForInterlocutorState}>
                {deleteForInterlocutor && <CheckBoxSvg />}
              </button>
              <span className='delete-message-modal__btn-description'>
                {t('deleteMessageModal.delete-for', {
                  name: selectedChatInterlocutorName,
                })}
              </span>
            </div>
          </div>
        }
        closeModal={onClose}
        buttons={[
          <button type='button' onClick={onClose} className='delete-message-modal__cancel-btn'>
            {t('deleteMessageModal.cancel')}
          </button>,
          <button type='button' onClick={deleteTheseMessages} className='delete-message-modal__confirm-btn'>
            {t('deleteMessageModal.delete-confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
