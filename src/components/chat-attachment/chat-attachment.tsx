import React from 'react';
import './chat-attachment.scss';

import { IGroupable, IBaseAttachment } from '@store/chats/models';

import { dateByOffset } from '../../utils/date-utils';

export function ChatAttachment<T extends IBaseAttachment>({
  items,
  AttachmentComponent,
}: {
  items: (T & IGroupable)[];
  AttachmentComponent: React.FC<T>;
}): JSX.Element {
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
