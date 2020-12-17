import React, { useCallback, useEffect, useRef, useState } from 'react';
import './file-attachment.scss';

import DownloadSvg from 'icons/ic-download.svg';
import ProgressSVG from 'icons/ic-progress.svg';

import { fileDownload } from 'app/utils/file-download';
import { RawAttachment } from 'store/chats/models';
import { getRawAttachmentsizeUnit } from 'app/utils/get-file-size-unit';

namespace FileAttachmentNS {
  export interface Props {
    attachment: RawAttachment;
  }
}

export const FileAttachment = React.memo(({ attachment }: FileAttachmentNS.Props) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);

  const abortDownloadingRef = useRef<XMLHttpRequest>();
  const progressSvgRef = useRef<SVGElement>(null);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(76 - (downloaded / attachment.byteSize) * 63);
    }
  }, [downloaded, progressSvgRef]);

  const download = useCallback(() => {
    abortDownloadingRef.current = fileDownload(attachment.url, attachment.title, setDownloaded, () => {
      setDownloaded(0);
      setIsDownloading(false);
    });
    setIsDownloading(true);
  }, [attachment, abortDownloadingRef, attachment, setDownloaded, setIsDownloading]);

  const abortDownloading = useCallback(() => {
    if (abortDownloadingRef.current) {
      abortDownloadingRef.current.abort();
    }
    setDownloaded(0);
    setIsDownloading(false);
  }, [setIsDownloading, setDownloaded, abortDownloadingRef]);

  return (
    <div className='file-attachment'>
      {isDownloading ? (
        <div onClick={abortDownloading} className='file-attachment__cancel'>
          <ProgressSVG ref={progressSvgRef} viewBox='0 0 25 25' className='file-attachment__progress-svg' />
        </div>
      ) : (
        <div onClick={download} className='file-attachment__download'>
          <DownloadSvg viewBox='0 0 25 25' />
        </div>
      )}
      <div className='file-attachment__data'>
        <h4 className='file-attachment__file-name'>{attachment.title}</h4>
        <div className='file-attachment__file-size'>
          {isDownloading
            ? `${getRawAttachmentsizeUnit(downloaded)}/${getRawAttachmentsizeUnit(attachment.byteSize)}`
            : getRawAttachmentsizeUnit(attachment.byteSize)}
        </div>
      </div>
    </div>
  );
});
