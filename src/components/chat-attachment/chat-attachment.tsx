import React from 'react';

import { IGroupable, IBaseAttachment } from '@store/chats/models';

import { dateByOffset } from '../../utils/date-utils';

import './chat-attachment.scss';

type ChatAttachmentProps<T> = {
  items: (T & IGroupable)[];
  AttachmentComponent: React.FC<T>;
};

export function ChatAttachment<T extends IBaseAttachment>({
  items,
  AttachmentComponent,
}: ChatAttachmentProps<T>): JSX.Element {
  return (
    <React.Fragment key={`${items[0]?.id}Arr`}>
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
    </React.Fragment>
  );
}
