import React, { useCallback, useMemo, useRef, useState } from 'react';

import classnames from 'classnames';
import { IAttachmentBase } from 'kimbu-models';

import { CircleProgressPreloader } from '@components/circle-progress-preloader/circle-progress-preloader';
import { ReactComponent as DownloadSvg } from '@icons/download.svg';
import { IAttachmentToSend } from '@store/chats/models';
import { fileDownload } from '@utils/file-download';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';
import './file-attachment.scss';

const BLOCK_NAME = 'file-attachment';

type AttachmentToSendType = IAttachmentToSend & { fileName?: string; className?: string };
type RawAttachmentType = IAttachmentBase & { className?: string; fileName?: string };
type FileAttachmentProps = RawAttachmentType | AttachmentToSendType;

const isRawAttachment = (props: FileAttachmentProps): props is RawAttachmentType => 'url' in props;

const FileAttachment: React.FC<FileAttachmentProps> = (props) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);

  const { byteSize, fileName, className } = props;

  const { success, uploadedBytes } = useMemo(() => {
    if (!isRawAttachment(props)) {
      return { ...(props as AttachmentToSendType) };
    }
    return { success: undefined, uploadedBytes: undefined };
  }, [props]);

  const { url } = useMemo(() => {
    if (isRawAttachment(props)) {
      return { ...(props as RawAttachmentType) };
    }
    return { url: undefined };
  }, [props]);

  const abortDownloadingRef = useRef<XMLHttpRequest>();

  const download = useCallback(() => {
    if (url) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      abortDownloadingRef.current = fileDownload(url, fileName!, setDownloaded, () => {
        setDownloaded(0);
        setIsDownloading(false);
      });
    }
    setIsDownloading(true);
  }, [url, fileName]);

  const abortDownloading = useCallback(() => {
    if (abortDownloadingRef.current) {
      abortDownloadingRef.current.abort();
    }
    setDownloaded(0);
    setIsDownloading(false);
  }, [setIsDownloading, setDownloaded, abortDownloadingRef]);

  return (
    <div className={classnames(BLOCK_NAME, className)}>
      {isDownloading ? (
        <div onClick={abortDownloading} className={`${BLOCK_NAME}__cancel`}>
          <CircleProgressPreloader byteSize={byteSize} uploadedBytes={downloaded} withCross />
        </div>
      ) : (
        <div onClick={download} className={`${BLOCK_NAME}__download`}>
          {uploadedBytes !== undefined && success === false ? (
            <CircleProgressPreloader byteSize={byteSize} uploadedBytes={uploadedBytes} />
          ) : (
            <DownloadSvg />
          )}
        </div>
      )}
      <div className={`${BLOCK_NAME}__data`}>
        <h4 className={`${BLOCK_NAME}__file-name`}>{fileName}</h4>
        <div className={`${BLOCK_NAME}__file-size`}>
          {isDownloading && `${getRawAttachmentSizeUnit(downloaded)}/${getRawAttachmentSizeUnit(byteSize)}`}
          {success === false
            ? `${getRawAttachmentSizeUnit(uploadedBytes || byteSize)}/${getRawAttachmentSizeUnit(byteSize)}`
            : getRawAttachmentSizeUnit(byteSize)}
        </div>
      </div>
    </div>
  );
};

FileAttachment.displayName = 'FileAttachment';

export { FileAttachment };
