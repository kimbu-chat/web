import React, { useMemo } from 'react';

import { MessageForm } from '@components/message-form/message-form';
import { AttachmentsMap } from '@components/message-item/attachments/attachments-map';
import { normalizeAttachments } from '@components/message-item/utilities';
import { MessageText } from '@components/message-text';
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
  const structuredAttachments = useMemo(
    () => normalizeAttachments(linkedMessage.attachments),
    [linkedMessage],
  );

  return (
    <MessageForm>
      <MessageText>{linkedMessage?.text}</MessageText>

      <AttachmentsMap
        className={`${BLOCK_NAME}__attachments`}
        structuredAttachments={structuredAttachments}
        isCurrentUserMessageCreator={isCurrentUserMessageCreator}
        observeIntersection={observeIntersection}
      />
    </MessageForm>
  );
};
