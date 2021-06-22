import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getRawAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatFilesSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/infinite-scroll';
import { FileAttachment } from '@components/file-attachment';
import { FILE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import './file-list.scss';
import { separateGroupable } from '@utils/date-utils';
import { ChatAttachment } from '@utils/chat-attachment/chat-attachment';
import { IBaseAttachment } from '@store/chats/models';

const FileAttachmentComponent: React.FC<IBaseAttachment> = ({ ...file }) => (
  <div>
    <FileAttachment {...file} />
  </div>
);

export const FileList = () => {
  const getRawAttachments = useActionWithDispatch(getRawAttachmentsAction);

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
    <div className="chat-files">
      <InfiniteScroll
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
