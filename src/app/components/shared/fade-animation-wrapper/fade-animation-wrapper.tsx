import React from 'react';
import './fade-animation-wrapper.scss';
import { CSSTransition } from 'react-transition-group';

namespace FadeAnimationWrapper {
	export interface Props {
		isDisplayed: boolean;
		children: JSX.Element;
	}
}

export const FadeAnimationWrapper: React.FC<FadeAnimationWrapper.Props> = React.memo(({ isDisplayed, children }) => {
	return (
		<CSSTransition unmountOnExit in={isDisplayed} timeout={{ enter: 200, exit: 200 }} classNames={'fade'}>
			{children}
		</CSSTransition>
	);
});
