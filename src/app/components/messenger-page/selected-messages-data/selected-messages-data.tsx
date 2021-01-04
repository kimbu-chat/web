import React, { useCallback, useContext, useState } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { getSelectedMessagesIdSelector } from 'store/chats/selectors';
import { LocalizationContext } from 'app/app';

import { FadeAnimationWrapper, ForwardModal } from 'components';
import { CopyMessages } from 'app/store/chats/features/copy-messages/copy-messages';
import { ReplyToMessage } from 'app/store/chats/features/reply-to-message/reply-to-message';
import { ResetSelectedMessages } from 'app/store/chats/features/select-message/reset-selected-messages';
import { EditMessage } from 'app/store/chats/features/edit-message/edit-message';
import { DeleteMessageModal } from './delete-message-modal/delete-message-modal';

export const SelectedMessagesData = React.memo(() => {
  const selectedMessages = useSelector(getSelectedMessagesIdSelector);
  const selectedMessagesCount = selectedMessages.length;

  const { t } = useContext(LocalizationContext);

  const copyMessage = useActionWithDispatch(CopyMessages.action);
  const resetSelectedMessages = useActionWithDispatch(ResetSelectedMessages.action);
  const replyToMessage = useActionWithDispatch(ReplyToMessage.action);
  const editMessage = useActionWithDispatch(EditMessage.action);

  const copyTheseMessages = useCallback(() => {
    copyMessage({ messageIds: selectedMessages });
    resetSelectedMessages();
  }, [selectedMessages]);

  const replyToSelectedMessage = useCallback(() => {
    replyToMessage({ messageId: selectedMessages[0] });
  }, [replyToMessage, selectedMessages]);

  const editSelectedMessage = useCallback(() => {
    editMessage({ messageId: selectedMessages[0] });
  }, [editMessage, selectedMessages]);

  // --Delete message logic
  const [deleteMessagesModalDisplayed, setDeleteMessagesModalDisplayed] = useState(false);
  const changeDeleteMessagesModalDisplayedState = useCallback(() => {
    setDeleteMessagesModalDisplayed((oldState) => !oldState);
  }, [setDeleteMessagesModalDisplayed]);

  // --Forward Message Logic
  const [messageIdsToForward, setMessageIdsToForward] = useState<number[]>([]);
  const changeForwardMessagesState = useCallback(() => {
    if (messageIdsToForward.length > 0) {
      setMessageIdsToForward([]);
    } else {
      setMessageIdsToForward(selectedMessages);
    }
  }, [setMessageIdsToForward, messageIdsToForward]);

  return (
    <div className='selected-messages-data'>
      <button type='button' onClick={changeForwardMessagesState} className='selected-messages-data__btn'>
        {t('selectedMessagesData.forward', { count: selectedMessagesCount })}
      </button>
      <button type='button' onClick={changeDeleteMessagesModalDisplayedState} className='selected-messages-data__btn selected-messages-data__btn--delete'>
        {t('selectedMessagesData.delete', { count: selectedMessagesCount })}
      </button>
      {selectedMessagesCount === 1 && (
        <button type='button' onClick={replyToSelectedMessage} className='selected-messages-data__btn'>
          {t('selectedMessagesData.reply')}
        </button>
      )}
      {selectedMessagesCount === 1 && (
        <button type='button' onClick={editSelectedMessage} className='selected-messages-data__btn '>
          {t('selectedMessagesData.edit')}
        </button>
      )}
      <button type='button' onClick={copyTheseMessages} className='selected-messages-data__btn'>
        {t('selectedMessagesData.copy')}
      </button>
      <button type='button' onClick={resetSelectedMessages} className='selected-messages-data__btn selected-messages-data__btn--cancel'>
        {t('selectedMessagesData.cancel')}
      </button>

      {
        //! Dynamically displayed modal using React.Portal
      }

      <FadeAnimationWrapper isDisplayed={deleteMessagesModalDisplayed}>
        <DeleteMessageModal onClose={changeDeleteMessagesModalDisplayedState} selectedMessages={selectedMessages} />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={messageIdsToForward?.length > 0}>
        <ForwardModal messageIdsToForward={messageIdsToForward} onClose={changeForwardMessagesState} />
      </FadeAnimationWrapper>
    </div>
  );
});
