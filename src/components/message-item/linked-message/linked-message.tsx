import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { AttachmentsMap } from '@components/message-item/attachments/attachments-map';
import { normalizeAttachments } from '@components/message-item/utilities';
import { ObserveFn } from '@hooks/use-intersection-observer';

import type { INormalizedLinkedMessage } from '@store/chats/models';

import './linked-message.scss';

export interface ILinkedMessage {
  linkedMessage: INormalizedLinkedMessage;
  observeIntersection: ObserveFn;
  isCurrentUserMessageCreator: boolean;
}

const BLOCK_NAME = 'linked-message';

export const LinkedMessage: React.FC<ILinkedMessage> = ({
  linkedMessage,
  observeIntersection,
  isCurrentUserMessageCreator,
}) => {
  const { t } = useTranslation();

  const structuredAttachments = useMemo(
    () => normalizeAttachments(linkedMessage.attachments),
    [linkedMessage],
  );

  return (
    <div className={BLOCK_NAME}>
      <span className={`${BLOCK_NAME}__text`}>
        {linkedMessage === null ? t('linkedMessage.message-deleted') : linkedMessage?.text}
      </span>

      <AttachmentsMap
        className={`${BLOCK_NAME}__attachments`}
        structuredAttachments={structuredAttachments}
        isCurrentUserMessageCreator={isCurrentUserMessageCreator}
        observeIntersection={observeIntersection}
      />
    </div>
  );
};
