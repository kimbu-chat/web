import React, { useCallback, useRef } from 'react';

import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { FileAttachment } from '@components/file-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getRawAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatFilesSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { setSeparators } from '@utils/set-separators';

import './file-list.scss';

const ATTACHMENTS_GROUP_PREFIX = 'files';

export const FileList = () => {
  const getRawAttachments = useActionWithDispatch(getRawAttachmentsAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const filesForSelectedChat = useSelector(getSelectedChatFilesSelector);

  const loadMore = useCallback(() => {
    getRawAttachments();
  }, [getRawAttachments]);

  const filesWithSeparators = setSeparators(
    filesForSelectedChat?.files,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-files" ref={containerRef}>
      <InfiniteScroll
        containerRef={containerRef}
        onReachBottom={loadMore}
        hasMore={filesForSelectedChat?.hasMore}
        isLoading={filesForSelectedChat?.loading}
        threshold={0.3}>
        {filesWithSeparators &&
          separateGroupable({
            groupableItems: filesWithSeparators,
            prefix: ATTACHMENTS_GROUP_PREFIX,
          }).map((pack) => (
            <div key={pack.id}>
              <ChatAttachment items={pack.attachments} AttachmentComponent={FileAttachment} />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};
