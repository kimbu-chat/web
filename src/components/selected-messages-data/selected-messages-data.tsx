import React, { useCallback } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ForwardModal } from '@components/forward-modal';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { copyMessagesAction, resetSelectedMessagesAction } from '@store/chats/actions';
import { getSelectedMessagesIdSelector } from '@store/chats/selectors';

import { DeleteMessageModal } from './delete-message-modal/delete-message-modal';

import './selected-messages-data.scss';

const BLOCK_NAME = 'selected-messages-data';

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
    <div className={BLOCK_NAME}>
      <button type="button" onClick={displayForwardMessagesModal} className={`${BLOCK_NAME}__btn`}>
        <ForwardSvg />
        <span>{t('selectedMessagesData.forward', { count: selectedMessagesCount })}</span>
      </button>

      <button
        type="button"
        onClick={displayDeleteMessagesModal}
        className={classnames(
          `${BLOCK_NAME}__btn`,
          `${BLOCK_NAME}__btn`,
          `${BLOCK_NAME}__btn--delete`,
        )}>
        <DeleteSvg />
        <span>{t('selectedMessagesData.delete', { count: selectedMessagesCount })}</span>
      </button>

      <button type="button" onClick={copyTheseMessages} className={`${BLOCK_NAME}__btn`}>
        <span>{t('selectedMessagesData.copy')}</span>
      </button>

      <button type="button" onClick={resetSelectedMessages} className={`${BLOCK_NAME}__close`}>
        <CloseSvg />
      </button>

      {deleteMessagesModalDisplayed && (
        <DeleteMessageModal onClose={hideDeleteMessagesModal} selectedMessages={selectedMessages} />
      )}

      {forwardMessagesModalDisplayed && (
        <ForwardModal messageIdsToForward={selectedMessages} onClose={hideForwardMessagesModal} />
      )}
    </div>
  );
};
