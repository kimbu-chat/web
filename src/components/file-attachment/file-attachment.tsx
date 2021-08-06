import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as DownloadSvg } from '@icons/download.svg';
import { ReactComponent as ProgressSVG } from '@icons/ic-progress.svg';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { fileDownload } from '@utils/file-download';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import './file-attachment.scss';

const FileAttachment: React.FC<INamedAttachment> = ({ ...attachment }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);

  const abortDownloadingRef = useRef<XMLHttpRequest>();
  const progressSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(
        76 - (downloaded / attachment.byteSize) * 63,
      );
    }
  }, [downloaded, progressSvgRef, attachment?.byteSize]);

  const download = useCallback(() => {
    if (attachment.url) {
      abortDownloadingRef.current = fileDownload(
        attachment.url,
        attachment.fileName || '',
        setDownloaded,
        () => {
          setDownloaded(0);
          setIsDownloading(false);
        },
      );
    }
    setIsDownloading(true);
  }, [attachment.url, attachment.fileName]);

  const abortDownloading = useCallback(() => {
    if (abortDownloadingRef.current) {
      abortDownloadingRef.current.abort();
    }
    setDownloaded(0);
    setIsDownloading(false);
  }, [setIsDownloading, setDownloaded, abortDownloadingRef]);

  return (
    <div className="file-attachment">
      {isDownloading ? (
        <div onClick={abortDownloading} className="file-attachment__cancel">
          <ProgressSVG
            ref={progressSvgRef}
            viewBox="0 0 25 25"
            className="file-attachment__progress-svg"
          />
        </div>
      ) : (
        <div onClick={download} className="file-attachment__download">
          <DownloadSvg viewBox="0 0 22 24" />
        </div>
      )}
      <div className="file-attachment__data">
        <h4 className="file-attachment__file-name">{attachment.fileName}</h4>
        <div className="file-attachment__file-size">
          {isDownloading
            ? `${getRawAttachmentSizeUnit(downloaded)}/${getRawAttachmentSizeUnit(
                attachment.byteSize,
              )}`
            : getRawAttachmentSizeUnit(attachment.byteSize)}
        </div>
      </div>
    </div>
  );
};

FileAttachment.displayName = 'FileAttachment';

export { FileAttachment };
