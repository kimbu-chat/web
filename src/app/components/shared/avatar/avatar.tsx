import React from 'react';

import './avatar.scss';

namespace IAvatar {
	export interface Props {
		src?: string;
		children: string;
		className?: string;
		onClick?: () => void;
	}
}

const Avatar = ({ src, children, className, onClick, ...props }: IAvatar.Props) => {
	return (
		<React.Fragment>
			{src ? (
				<img src={src} {...props} onClick={onClick} className={`avatar ${className ? className : ''}`}></img>
			) : (
				<div {...props} onClick={onClick} className={`avatar ${className ? className : ''}`}>
					{children}
				</div>
			)}
		</React.Fragment>
	);
};

export default Avatar;
