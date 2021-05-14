import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getRawAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatFilesSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { doesYearDifferFromCurrent, setSeparators } from '@utils/set-separators';
import { InfiniteScroll, FileAttachment } from '@components';
import { FILE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import './file-list.scss';

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
        onReachExtreme={loadMore}
        hasMore={filesForSelectedChat?.hasMore}
        isLoading={filesForSelectedChat?.loading}
        threshold={0.3}>
        {filesWithSeparators?.map((file) => (
          <React.Fragment key={file.id}>
            {file.needToShowMonthSeparator && (
              <div className="chat-files__separator">
                {file.needToShowYearSeparator || doesYearDifferFromCurrent(file.creationDateTime)
                  ? dayjs(file.creationDateTime).format('MMMM YYYY')
                  : dayjs(file.creationDateTime).format('MMMM')}
              </div>
            )}
            <FileAttachment {...file} />
          </React.Fragment>
        ))}
      </InfiniteScroll>
    </div>
  );
};
