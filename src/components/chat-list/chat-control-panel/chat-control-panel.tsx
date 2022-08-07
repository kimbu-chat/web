import React, { useEffect, useCallback } from 'react';

import Mousetrap from 'mousetrap';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import { stopPropagation } from '@utils/stop-propagation';

import './chat-control-panel.scss';

interface IChatControlPanelProps {
  onClose: () => void;
  onCreateGroupChat: () => void;
  onCreateAddFriend: () => void;
  onCreateNewChat: () => void;
}

const BLOCK_NAME = 'chat-control-panel';

const ChatControlPanel: React.FC<IChatControlPanelProps> = React.memo(
  ({ onClose, onCreateGroupChat, onCreateAddFriend, onCreateNewChat }) => {
    const { t } = useTranslation();

    useEffect(() => {
      Mousetrap.bind('esc', (e) => {
        e.preventDefault();

        onClose();
      });

      return () => {
        Mousetrap.unbind('esc');
      };
    }, [onClose]);

    const openCreateGroupChat = useCallback(() => {
        onCreateGroupChat();
        onClose()
    }, [onCreateGroupChat, onClose])

    const openCreateNewChat = useCallback(() => {
        onCreateNewChat();
        onClose()
    }, [onCreateNewChat, onClose])

    const openCreateAddFriend = useCallback(() => {
        onCreateAddFriend();
        onClose()
    }, [onCreateAddFriend, onClose])

    return (
      <div className={BLOCK_NAME} onClick={onClose}>
        <div className={`${BLOCK_NAME}__items`} onClick={stopPropagation}>
          <button
            type="button"
            onClick={openCreateGroupChat}
            className={`${BLOCK_NAME}__items__item`}>
            <GroupSvg className={`${BLOCK_NAME}__items__item-logo`} />
            <span className={`${BLOCK_NAME}__items__item-title`}>
              {t('chatActions.create-group-chat')}
            </span>
          </button>
          <button
            type="button"
            onClick={openCreateNewChat}
            className={`${BLOCK_NAME}__items__item`}>
            <SendSvg className={`${BLOCK_NAME}__items__item-logo`} />
            <span className={`${BLOCK_NAME}__items__item-title`}>
              {t('chatActions.new-direct-message')}
            </span>
          </button>
          <button
            type="button"
            onClick={openCreateAddFriend}
            className={`${BLOCK_NAME}__items__item`}>
            <AddContactSvg className={`${BLOCK_NAME}__items__item-logo`} />
            <span className={`${BLOCK_NAME}__items__item-title`}>
              {t('chatActions.add-new-contact')}
            </span>
          </button>
        </div>
      </div>
    );
  },
);

export { ChatControlPanel };
