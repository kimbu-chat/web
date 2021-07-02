import React, { useCallback } from 'react';
import './selected-messages-data.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getSelectedMessagesIdSelector } from '@store/chats/selectors';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { ForwardModal } from '@components/forward-modal';
import { useToggledState } from '@hooks/use-toggled-state';
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

  const [deleteMessagesModalDisplayed, displayDeleteMessagesModal, hideDeleteMessagesModal] =
    useToggledState(false);
  const [forwardMessagesModalDisplayed, displayForwardMessagesModal, hideForwardMessagesModal] =
    useToggledState(false);

  return (
    <div className="selected-messages-data">
      <button
        type="button"
        onClick={displayForwardMessagesModal}
        className="selected-messages-data__btn">
        <ForwardSvg viewBox="0 0 16 16" />
        <span>{t('selectedMessagesData.forward', { count: selectedMessagesCount })}</span>
      </button>

      <button
        type="button"
        onClick={displayDeleteMessagesModal}
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

      {deleteMessagesModalDisplayed && (
        <DeleteMessageModal onClose={hideDeleteMessagesModal} selectedMessages={selectedMessages} />
      )}

      {forwardMessagesModalDisplayed && (
        <ForwardModal messageIdsToForward={selectedMessages} onClose={hideForwardMessagesModal} />
      )}
    </div>
  );
};
