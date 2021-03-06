import React from 'react';

import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import {
  LinkedMessage,
  ILinkedMessageProps,
} from '@components/message-item/linked-message/linked-message';
import { MessageHandler } from '@components/message-item/message-handler';
import { getUserSelector } from '@store/users/selectors';

import './replied-message.scss';

const BLOCK_NAME = 'replied-message';

const RepliedMessage: React.FC<ILinkedMessageProps> = ({
  linkedMessage,
  observeIntersection,
  isCurrentUserMessageCreator,
}) => {
  const userCreator = useSelector(getUserSelector(linkedMessage?.userCreatorId));

  return (
    <MessageHandler linkedMessage={linkedMessage}>
      <div className={BLOCK_NAME}>
        <Avatar size={32} user={userCreator} className={`${BLOCK_NAME}__avatar`} />

        <LinkedMessage
          linkedMessage={linkedMessage}
          observeIntersection={observeIntersection}
          isCurrentUserMessageCreator={isCurrentUserMessageCreator}
        />
      </div>
    </MessageHandler>
  );
};

RepliedMessage.displayName = 'RepliedMessage';

export { RepliedMessage };
