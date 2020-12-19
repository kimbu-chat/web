import React from 'react';
import './fade-animation-wrapper.scss';
import { CSSTransition } from 'react-transition-group';

namespace FadeAnimationWrapperNS {
  export interface Props {
    isDisplayed: boolean;
    children: JSX.Element;
  }
}

const FadeAnimationWrapper: React.FC<FadeAnimationWrapperNS.Props> = React.memo(
  ({ isDisplayed, children }) => (
    <CSSTransition unmountOnExit in={isDisplayed} timeout={{ enter: 200, exit: 200 }} classNames='fade'>
      {children}
    </CSSTransition>
  ),
  (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed && prevProps.children !== nextProps.children,
);

FadeAnimationWrapper.displayName = 'FadeAnimationWrapper';

export { FadeAnimationWrapper };
