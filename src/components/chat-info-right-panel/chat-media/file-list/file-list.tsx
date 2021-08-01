import React, { useCallback, useRef } from 'react';

import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { FileAttachment } from '@components/file-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getRawAttachmentsAction } from '@store/chats/actions';
import { IBaseAttachment } from '@store/chats/models';
import { getSelectedChatFilesSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { separateGroupable } from '@utils/date-utils';
import { FILE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { setSeparators } from '@utils/set-separators';

import './file-list.scss';

const FileAttachmentComponent: React.FC<IBaseAttachment> = ({ ...file }) => (
  <div>
    <FileAttachment {...file} />
  </div>
);

export const FileList = () => {
  const getRawAttachments = useActionWithDispatch(getRawAttachmentsAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const filesForSelectedChat = useSelector(getSelectedChatFilesSelector);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: filesForSelectedChat?.files.length || 0,
      limit: FILE_ATTACHMENTS_LIMIT,
    };

    getRawAttachments({
      page,
    });
  }, [filesForSelectedChat?.files, getRawAttachments]);

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
          separateGroupable(filesWithSeparators).map((filesArr) => (
            <div key={`${filesArr[0]?.id}Arr`}>
              <ChatAttachment items={filesArr} AttachmentComponent={FileAttachmentComponent} />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};
