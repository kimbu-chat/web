import React from 'react';
import ReactDOM from 'react-dom';

namespace BackgroundBlur {
	export interface Props {
		onClick: () => void;
	}
}

export const BackgroundBlur: React.FC<BackgroundBlur.Props> = ({ onClick, children }) => {
	return ReactDOM.createPortal(
		<div onClick={onClick} className='background-blur'>
			{children}
		</div>,
		document.getElementById('root') || document.createElement('div'),
	);
};

namespace WithBackground {
	export interface Props {
		children?: JSX.Element | boolean;
		onBackgroundClick: () => void;
	}
}

const WithBackground = ({ children, onBackgroundClick }: WithBackground.Props) => {
	return (
		<React.Fragment>
			<BackgroundBlur onClick={onBackgroundClick}>{children}</BackgroundBlur>
		</React.Fragment>
	);
};

export default WithBackground;
