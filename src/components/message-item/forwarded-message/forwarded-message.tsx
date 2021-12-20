import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LinkedMessage, ILinkedMessageProps } from '@components/message-item/linked-message';
import { withMessageHandler } from '@components/message-item/message-handler';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { ChatId } from '@store/chats/chat-id';
import { replaceInUrl } from '@utils/replace-in-url';
import { getUserName } from '@utils/user-utils';

import type { IUser } from 'kimbu-models';

import './forwarded-message.scss';

const BLOCK_NAME = 'forwarded-message';

interface IForwardedMessageProps extends ILinkedMessageProps {
  linkedMessageUserCreator?: IUser;
}

const ForwardedMessage: React.FC<IForwardedMessageProps> = ({
  linkedMessageUserCreator,
  linkedMessage,
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
      <LinkedMessage {...props} linkedMessage={linkedMessage} />
    </>
  );
};

export const ForwardMessageWithHandler = withMessageHandler(ForwardedMessage);
