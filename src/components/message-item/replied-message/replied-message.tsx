import React from 'react';

import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import {
  LinkedMessage,
  ILinkedMessage,
} from '@components/message-item/linked-message/linked-message';
import { getUserSelector } from '@store/users/selectors';

import './replied-message.scss';

const BLOCK_NAME = 'replied-message';

const RepliedMessage: React.FC<ILinkedMessage> = ({
  linkedMessage,
  observeIntersection,
  isCurrentUserMessageCreator,
}) => {
  const userCreator = useSelector(getUserSelector(linkedMessage?.userCreatorId));

  return (
    <div className={BLOCK_NAME}>
      <Avatar size={32} user={userCreator} className={`${BLOCK_NAME}__avatar`} />

      <LinkedMessage
        linkedMessage={linkedMessage}
        observeIntersection={observeIntersection}
        isCurrentUserMessageCreator={isCurrentUserMessageCreator}
      />
    </div>
  );
};

RepliedMessage.displayName = 'RepliedMessage';

export { RepliedMessage };
