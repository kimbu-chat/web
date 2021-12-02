import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LinkedMessage, ILinkedMessage } from '@components/message-item/linked-message';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { replaceInUrl } from '@utils/replace-in-url';
import { getUserName } from '@utils/user-utils';

import type { IUser } from 'kimbu-models';

import './forwarded-message.scss';

const BLOCK_NAME = 'forwarded-message';

interface IForwardedMessage extends ILinkedMessage {
  linkedMessageUserCreator?: IUser;
}

export const ForwardedMessage: React.FC<IForwardedMessage> = ({
  linkedMessageUserCreator,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={BLOCK_NAME}>
        {t('messageItem.forward-indicator')}
        <Link
          to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, [
            'id?',
            ChatId.from(linkedMessageUserCreator?.id).id,
          ])}
          className={`${BLOCK_NAME}__name`}>
          {linkedMessageUserCreator && getUserName(linkedMessageUserCreator, t)}
        </Link>
      </div>
      <LinkedMessage {...props} />
    </>
  );
};
