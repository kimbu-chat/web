import React from 'react';

import { IAttachmentBase } from 'kimbu-models';

import { IGroupable } from '@store/chats/models';

import { dateByOffset } from '../../utils/date-utils';

import './chat-attachment.scss';

type ChatAttachmentProps<T> = {
  items: (T & IGroupable)[];
  AttachmentComponent: React.FC<T>;
};

export function ChatAttachment<T extends IAttachmentBase>({
  items,
  AttachmentComponent,
}: ChatAttachmentProps<T>) {
  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {item.needToShowMonthSeparator && (
            <div className="chat-attachment__separator">
              {item.needToShowYearSeparator && dateByOffset(item.creationDateTime)}
            </div>
          )}
          <AttachmentComponent {...item} />
        </React.Fragment>
      ))}
    </>
  );
}
