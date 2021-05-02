import React, { useCallback, useState } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedMessagesIdSelector } from '@store/chats/selectors';

import { useTranslation } from 'react-i18next';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';

import { FadeAnimationWrapper } from '@components/shared';
import { ForwardModal } from '@components/messenger-page';
import { copyMessagesAction, resetSelectedMessagesAction } from '@store/chats/actions';
import { DeleteMessageModal } from './delete-message-modal/delete-message-modal';

export const SelectedMessagesData = () => {
  const selectedMessages = useSelector(getSelectedMessagesIdSelector);
  const selectedMessagesCount = selectedMessages.length;

  const { t } = useTranslation();

  const copyMessage = useActionWithDispatch(copyMessagesAction);
  const resetSelectedMessages = useActionWithDispatch(resetSelectedMessagesAction);

  const copyTheseMessages = useCallback(() => {
    copyMessage({ messageIds: selectedMessages });
    resetSelectedMessages();
  }, [copyMessage, resetSelectedMessages, selectedMessages]);

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
      <button
        type="button"
        onClick={changeForwardMessagesModalDisplayedState}
        className="selected-messages-data__btn">
        <ForwardSvg viewBox="0 0 16 16" />
        <span>{t('selectedMessagesData.forward', { count: selectedMessagesCount })}</span>
      </button>

      <button
        type="button"
        onClick={changeDeleteMessagesModalDisplayedState}
        className="selected-messages-data__btn selected-messages-data__btn--delete">
        <DeleteSvg viewBox="0 0 15 16" />
        <span>{t('selectedMessagesData.delete', { count: selectedMessagesCount })}</span>
      </button>

      <button type="button" onClick={copyTheseMessages} className="selected-messages-data__btn">
        <span>{t('selectedMessagesData.copy')}</span>
      </button>

      <button
        type="button"
        onClick={resetSelectedMessages}
        className="selected-messages-data__close">
        <CloseSvg />
      </button>

      {
        //! Dynamically displayed modal using React.Portal
      }

      <FadeAnimationWrapper isDisplayed={deleteMessagesModalDisplayed}>
        <DeleteMessageModal
          onClose={changeDeleteMessagesModalDisplayedState}
          selectedMessages={selectedMessages}
        />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={forwardMessagesModalDisplayed}>
        <ForwardModal
          messageIdsToForward={selectedMessages}
          onClose={changeForwardMessagesModalDisplayedState}
        />
      </FadeAnimationWrapper>
    </div>
  );
};
