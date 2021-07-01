import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { leaveGroupChatAction } from '@store/chats/actions';
import { getSelectedGroupChatNameSelector } from '@store/chats/selectors';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';

import './leave-chat-modal.scss';

interface ILeaveChatModalProps {
  hide: () => void;
}

const BLOCK_NAME = 'leave-chat-modal';

export const LeaveChatModal: React.FC<ILeaveChatModalProps> = ({ hide }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const selectedGroupChatName = useSelector(getSelectedGroupChatNameSelector);

  const leaveGroupChat = useEmptyActionWithDeferred(leaveGroupChatAction);

  const deleteGroupChat = useCallback(() => {
    setLoading(true);
    leaveGroupChat().then(() => {
      setLoading(false);
      history.push('/im');
    });
  }, [leaveGroupChat, history]);

  return (
    <Modal closeModal={hide}>
      <>
        <Modal.Header>{t('chatActions.leave-chat')}</Modal.Header>
        <div className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__сontent`}>
            {t('chatInfo.leave-confirmation', { groupChatName: selectedGroupChatName })
              .split(selectedGroupChatName || '')
              .map((text, index, arr) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                  <span className={`${BLOCK_NAME}__сontent__text`}>{text}</span>
                  {index < arr.length - 1 && (
                    <span
                      className={classNames(
                        `${BLOCK_NAME}__сontent__text`,
                        `${BLOCK_NAME}__сontent__text--highlighted`,
                      )}>
                      {selectedGroupChatName}
                    </span>
                  )}
                </React.Fragment>
              ))}
          </div>
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button type="button" className={`${BLOCK_NAME}__cancel-btn`} onClick={hide}>
              {t('chatInfo.cancel')}
            </button>
            <Button
              loading={loading}
              type="button"
              className={`${BLOCK_NAME}__confirm-btn`}
              onClick={deleteGroupChat}>
              {t('chatInfo.leave')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};
