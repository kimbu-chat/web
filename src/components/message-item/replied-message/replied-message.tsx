import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Avatar } from '@components/avatar';
import { AttachmentsMap } from '@components/message-item/attachments/attachments-map';
import { normalizeAttachments } from '@components/message-item/utilities';
import { INormalizedLinkedMessage } from '@store/chats/models';
import { getUserSelector } from '@store/users/selectors';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './replied-message.scss';

interface IRepliedMessageProps {
  linkedMessage: INormalizedLinkedMessage;
  observeIntersection: ObserveFn;
  isCurrentUserMessageCreator: boolean;
}

const BLOCK_NAME = 'replied-message';

const RepliedMessage: React.FC<IRepliedMessageProps> = ({
  linkedMessage,
  observeIntersection,
  isCurrentUserMessageCreator,
}) => {
  const { t } = useTranslation();

  const userCreator = useSelector(getUserSelector(linkedMessage?.userCreatorId));

  const structuredAttachments = useMemo(() => normalizeAttachments(linkedMessage.attachments), [linkedMessage]);

  return (
    <div className={BLOCK_NAME}>
      <Avatar size={32} user={userCreator} />

      <div className={`${BLOCK_NAME}__contents`}>
        <span className={`${BLOCK_NAME}__text`}>
          {linkedMessage === null ? t('repliedMessage.message-deleted') : linkedMessage?.text}
        </span>

        <AttachmentsMap
          structuredAttachments={structuredAttachments}
          isCurrentUserMessageCreator={isCurrentUserMessageCreator}
          observeIntersection={observeIntersection}
        />
      </div>
    </div>
  );
};

RepliedMessage.displayName = 'RepliedMessage';

export { RepliedMessage };
