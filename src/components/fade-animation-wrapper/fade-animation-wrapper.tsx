import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './fade-animation-wrapper.scss';

interface IFadeAnimationWrapperProps {
  isDisplayed: boolean;
  children: JSX.Element;
}

const DEFAULT_TIMEOUT = 0;

const CLASS_NAMES = 'fade';

const FadeAnimationWrapper: React.FC<IFadeAnimationWrapperProps> = ({ isDisplayed, children }) => (
  <CSSTransition
    unmountOnExit
    in={isDisplayed}
    timeout={{ enter: DEFAULT_TIMEOUT, exit: DEFAULT_TIMEOUT }}
    classNames={CLASS_NAMES}>
    {children}
  </CSSTransition>
);

FadeAnimationWrapper.displayName = 'FadeAnimationWrapper';

export { FadeAnimationWrapper };
