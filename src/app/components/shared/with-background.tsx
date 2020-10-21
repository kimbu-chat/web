import React from 'react';
import ReactDOM from 'react-dom';
import CSSTransition from 'react-transition-group/CSSTransition';

namespace BackgroundBlur {
	export interface Props {
		onClick: () => void;
	}
}

export const BackgroundBlur = ({ onClick }: BackgroundBlur.Props) => {
	return ReactDOM.createPortal(
		<div onClick={onClick} className='background-blur'></div>,
		document.getElementById('root') || document.createElement('div'),
	);
};

namespace WithBackground {
	export interface Props {
		isBackgroundDisplayed: boolean;
		children?: JSX.Element | boolean;
		onBackgroundClick: () => void;
	}
}

const WithBackground = ({ isBackgroundDisplayed, children, onBackgroundClick }: WithBackground.Props) => {
	return (
		<React.Fragment>
			<CSSTransition
				unmountOnExit
				in={isBackgroundDisplayed}
				timeout={{ enter: 200, exit: 200 }}
				classNames={'fade'}
			>
				<BackgroundBlur onClick={onBackgroundClick} />
			</CSSTransition>
			{children}
		</React.Fragment>
	);
};

export default WithBackground;
