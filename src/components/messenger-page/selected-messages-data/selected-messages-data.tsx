import React, { useCallback, useContext, useState } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedMessagesIdSelector } from '@store/chats/selectors';
import { LocalizationContext } from '@contexts';
import CloseSvg from '@icons/close.svg';
import ForwardSvg from '@icons/forward.svg';
import DeleteSvg from '@icons/delete.svg';

import { FadeAnimationWrapper, ForwardModal } from '@components';
import { CopyMessages } from '@store/chats/features/copy-messages/copy-messages';
import { ResetSelectedMessages } from '@store/chats/features/select-message/reset-selected-messages';
import { DeleteMessageModal } from './delete-message-modal/delete-message-modal';

export const SelectedMessagesData = React.memo(() => {
  const selectedMessages = useSelector(getSelectedMessagesIdSelector);
  const selectedMessagesCount = selectedMessages.length;

  const { t } = useContext(LocalizationContext);

  const copyMessage = useActionWithDispatch(CopyMessages.action);
  const resetSelectedMessages = useActionWithDispatch(ResetSelectedMessages.action);

  const copyTheseMessages = useCallback(() => {
    copyMessage({ messageIds: selectedMessages });
    resetSelectedMessages();
  }, [selectedMessages]);

  // --Delete message logic
  const [deleteMessagesModalDisplayed, setDeleteMessagesModalDisplayed] = useState(false);
  const changeDeleteMessagesModalDisplayedState = useCallback(() => {
    setDeleteMessagesModalDisplayed((oldState) => !oldState);
  }, [setDeleteMessagesModalDisplayed]);

  // --Forward Message Logic
  const [forwardMessagesModalDisplayed, setForwardMessagesModalDisplayed] = useState(false);
  const changeForwardMessagesModalDisplayedState = useCallback(() => {
    setForwardMessagesModalDisplayed((oldState) => !oldState);
  }, [setForwardMessagesModalDisplayed]);

  return (
    <div className="selected-messages-data">
      <button type="button" onClick={changeForwardMessagesModalDisplayedState} className="selected-messages-data__btn">
        <ForwardSvg viewBox="0 0 16 16" />
        <span>{t('selectedMessagesData.forward', { count: selectedMessagesCount })}</span>
      </button>

      <button
        type="button"
        onClick={changeDeleteMessagesModalDisplayedState}
        className="selected-messages-data__btn selected-messages-data__btn--delete"
      >
        <DeleteSvg viewBox="0 0 15 16" />
        <span>{t('selectedMessagesData.delete', { count: selectedMessagesCount })}</span>
      </button>

      <button type="button" onClick={copyTheseMessages} className="selected-messages-data__btn">
        <span>{t('selectedMessagesData.copy')}</span>
      </button>

      <button type="button" onClick={resetSelectedMessages} className="selected-messages-data__close">
        <CloseSvg />
      </button>

      {
        //! Dynamically displayed modal using React.Portal
      }

      <FadeAnimationWrapper isDisplayed={deleteMessagesModalDisplayed}>
        <DeleteMessageModal onClose={changeDeleteMessagesModalDisplayedState} selectedMessages={selectedMessages} />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={forwardMessagesModalDisplayed}>
        <ForwardModal messageIdsToForward={selectedMessages} onClose={changeForwardMessagesModalDisplayedState} />
      </FadeAnimationWrapper>
    </div>
  );
});
