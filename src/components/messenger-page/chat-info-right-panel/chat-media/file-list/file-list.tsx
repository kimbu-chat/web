import React, { useCallback } from 'react';
import './file-list.scss';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { getRawAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatFilesSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from '@utils/set-separators';
import { InfiniteScroll, FileAttachment } from '@components/messenger-page';
import { FILE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

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
                  ? moment(file.creationDateTime).format('MMMM YYYY')
                  : moment(file.creationDateTime).format('MMMM')}
              </div>
            )}
            <FileAttachment {...file} />
          </React.Fragment>
        ))}
      </InfiniteScroll>
    </div>
  );
};
