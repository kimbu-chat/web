import React from 'react';

import { useTranslation } from 'react-i18next';

import { MessageForm } from '@components/message-form/message-form';
import { MessageTextState, MessageText } from '@components/message-text';
import { INormalizedLinkedMessage } from '@store/chats/models';

interface IMessageHandler {
  linkedMessage: INormalizedLinkedMessage;
}

export const MessageHandler: React.FC<IMessageHandler> = ({ children, linkedMessage }) => {
  const { t } = useTranslation();
  if (!linkedMessage) {
    return (
      <MessageForm>
        <MessageText state={MessageTextState.DELETED}>
          {t('linkedMessage.message-deleted')}
        </MessageText>
      </MessageForm>
    );
  }

  return <>{children}</>;
};

export function withMessageHandler<P extends { linkedMessage: INormalizedLinkedMessage }>(
  Component: React.FC<P>,
) {
  return (props: P) => {
    const { t } = useTranslation();
    const { linkedMessage } = props;

    if (!linkedMessage) {
      return (
        <MessageForm>
          <MessageText state={MessageTextState.DELETED}>
            {t('linkedMessage.message-deleted')}
          </MessageText>
        </MessageForm>
      );
    }

    return <Component {...props} />;
  };
}
