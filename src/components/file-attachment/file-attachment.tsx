import React, { useCallback, useEffect, useRef, useState } from 'react';

import classnames from 'classnames';
import { IAttachmentBase } from 'kimbu-models';

import { ReactComponent as DownloadSvg } from '@icons/download.svg';
import { ReactComponent as ProgressSVG } from '@icons/ic-progress.svg';
import { fileDownload } from '@utils/file-download';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import './file-attachment.scss';

const BLOCK_NAME = 'file-attachment';

type FileAttachmentProps = IAttachmentBase & { fileName?: string; className?: string };

function FileAttachment<T extends FileAttachmentProps>({ fileName, byteSize, url, className }: T) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);

  const abortDownloadingRef = useRef<XMLHttpRequest>();
  const progressSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(
        76 - (downloaded / byteSize) * 63,
      );
    }
  }, [downloaded, progressSvgRef, byteSize]);

  const download = useCallback(() => {
    if (url) {
      abortDownloadingRef.current = fileDownload(url, fileName || '', setDownloaded, () => {
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
          <ProgressSVG ref={progressSvgRef} className={`${BLOCK_NAME}__progress-svg`} />
        </div>
      ) : (
        <div onClick={download} className={`${BLOCK_NAME}__download`}>
          <DownloadSvg />
        </div>
      )}
      <div className={`${BLOCK_NAME}__data`}>
        <h4 className={`${BLOCK_NAME}__file-name`}>{fileName}</h4>
        <div className={`${BLOCK_NAME}__file-size`}>
          {isDownloading
            ? `${getRawAttachmentSizeUnit(downloaded)}/${getRawAttachmentSizeUnit(byteSize)}`
            : getRawAttachmentSizeUnit(byteSize)}
        </div>
      </div>
    </div>
  );
}

FileAttachment.displayName = 'FileAttachment';

export { FileAttachment };
