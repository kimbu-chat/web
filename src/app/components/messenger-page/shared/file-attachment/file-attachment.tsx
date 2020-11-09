import React, { useCallback, useRef, useState } from 'react';
import './file-attachment.scss';

import DownloadSvg from 'app/assets/icons/ic-download.svg';
import ProgressSVG from 'app/assets/icons/ic-circular-progress.svg';
import CloseSVG from 'app/assets/icons/ic-close.svg';

import { fileDownload } from 'app/utils/functions/file-download';
import { RawAttachment } from 'app/store/chats/models';
import { getFileSizeUnit } from 'app/utils/functions/get-file-size-unit';

namespace FileAttachment {
	export interface Props {
		attachment: RawAttachment;
	}
}

const FileAttachment = ({ attachment }: FileAttachment.Props) => {
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloaded, setDownloaded] = useState(0);

	const abortDownloadingRef = useRef<() => void>();

	const download = useCallback(() => {
		abortDownloadingRef.current = fileDownload(attachment.url, attachment.title, setDownloaded);
		setIsDownloading(true);
	}, [attachment, abortDownloadingRef, attachment, setDownloaded, setIsDownloading]);

	return (
		<div className='file-attachment'>
			{isDownloading ? (
				<div onClick={abortDownloadingRef.current} className='file-attachment__cancel'>
					<CloseSVG className='file-attachment__close-svg' viewBox='0 0 25 25' />
					<ProgressSVG className='file-attachment__progress-svg' />
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
						? `${getFileSizeUnit(downloaded)}/${getFileSizeUnit(attachment.byteSize)}`
						: getFileSizeUnit(attachment.byteSize)}
				</div>
			</div>
		</div>
	);
};

export default FileAttachment;
