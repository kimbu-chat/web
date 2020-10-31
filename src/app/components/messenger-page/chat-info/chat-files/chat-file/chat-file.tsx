import { AttachedFile } from 'app/store/chats/models';
import moment from 'moment';
import React from 'react';

namespace ChatFileNS {
	export interface Props {
		file: AttachedFile;
	}
}

const ChatFile: React.FC<ChatFileNS.Props> = ({ file }) => {
	return (
		<>
			{file.needToShowSeparator && (
				<div className='chat-files__separator'>{moment(file.creationDateTime).format('MMMM')}</div>
			)}
			<div className='chat-file'>
				<div className='chat-file__name'>{file.title}</div>
				<div className='chat-file__size'>
					{file.byteSize > 1048575
						? `${(file.byteSize / 1048576).toFixed(2)} Mb`
						: file.byteSize > 1024
						? `${(file.byteSize / 1024).toFixed(2)} Kb`
						: `${file.byteSize.toFixed(2)} bytes`}
				</div>
				<div className='chat-file__download'>Download</div>
			</div>
		</>
	);
};

export default ChatFile;
