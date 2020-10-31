import React, { useCallback } from 'react';
import './file-attachment.scss';
import { FileBase } from 'app/store/messages/models';

import DownloadSvg from 'app/assets/icons/ic-download.svg';
import { AttachedFile } from 'app/store/chats/models';
import { fileDownload } from 'app/utils/file-download';

namespace FileAttachment {
	export interface Props {
		attachment: FileBase | AttachedFile;
	}
}

const FileAttachment = ({ attachment }: FileAttachment.Props) => {
	const download = useCallback(() => {
		fileDownload(attachment.url, attachment.title);
	}, [attachment]);
	return (
		<div className='file-attachment'>
			<div onClick={download} className='file-attachment__download'>
				<DownloadSvg viewBox='0 0 25 25' />
			</div>
			<div className='file-attachment__data'>
				<h4 className='file-attachment__file-name'>{attachment.title}</h4>
				<div className='file-attachment__file-size'>
					{attachment.byteSize > 1048575
						? `${(attachment.byteSize / 1048576).toFixed(2)} Mb`
						: attachment.byteSize > 1024
						? `${(attachment.byteSize / 1024).toFixed(2)} Kb`
						: `${attachment.byteSize.toFixed(2)} bytes`}
				</div>
			</div>
		</div>
	);
};

export default FileAttachment;
