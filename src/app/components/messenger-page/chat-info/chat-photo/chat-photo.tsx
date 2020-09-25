import React from 'react';
import './chat-photo.scss';

namespace ChatPhoto {
	export interface Props {
		isDisplayed: boolean;
		close: () => void;
	}
}

const ChatPhoto = ({ isDisplayed }: ChatPhoto.Props) => {
	return <div className={isDisplayed ? 'chat-photo chat-photo--active' : 'chat-photo'}></div>;
};

export default ChatPhoto;
