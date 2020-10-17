import React from 'react';
import './file-attachment.scss';
import { FileBase } from 'app/store/messages/models';

import DownloadSvg from 'app/assets/icons/ic-arrow-down.svg';

namespace FileAttachment {
	export interface Props {
		attachment: FileBase;
	}
}

const FileAttachment = ({ attachment }: FileAttachment.Props) => {
	return (
		<div className='file-attachment'>
			<a href={attachment.url} download className='file-attachment__download'>
				<DownloadSvg viewBox='0 0 25 25' />
			</a>
			<div className='file-attachment__data'>
				<div className='file-attachment__file-data'>
					<h4 className='file-attachment__file-name'>{attachment.fileName}</h4>
					<div className='file-attachment__file-size'>
						{attachment.byteSize > 1048575
							? `${(attachment.byteSize / 1048576).toFixed(2)} Mb`
							: attachment.byteSize > 1024
							? `${(attachment.byteSize / 1024).toFixed(2)} Kb`
							: `${attachment.byteSize.toFixed(2)} bytes`}
					</div>
				</div>
				<a href={attachment.url} download className='file-attachment__download-label'>
					Download
				</a>
			</div>
		</div>
	);
};

export default FileAttachment;