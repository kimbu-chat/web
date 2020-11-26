import Mousetrap from 'mousetrap';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

namespace BackgroundBlur {
	export interface Props {
		onClick: () => void;
	}
}

export const BackgroundBlur: React.FC<BackgroundBlur.Props> = ({ onClick, children }) => {
	useEffect(() => {
		Mousetrap.bind('esc', (e) => {
			e.preventDefault();
			onClick();
		});

		return () => {
			Mousetrap.unbind('esc');
		};
	}, [onClick]);
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

export const WithBackground = React.memo(({ children, onBackgroundClick }: WithBackground.Props) => {
	return (
		<React.Fragment>
			<BackgroundBlur onClick={onBackgroundClick}>{children}</BackgroundBlur>
		</React.Fragment>
	);
});
