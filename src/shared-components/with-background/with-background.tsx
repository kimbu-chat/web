import React, { useEffect, useCallback } from 'react';

import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import ReactDOM from 'react-dom';

import './with-background.scss';

export enum AnimationMode {
  ENABLED,
  CLOSE,
}

interface IBackgroundBlurProps {
  onClick?: () => void;
  hiding?: boolean;
  animationMode?: AnimationMode;
  children: React.ReactNode;
}

const BLOCK_NAME = 'background-blur';

const BackgroundBlur: React.FC<IBackgroundBlurProps> = ({
  onClick,
  children,
  hiding,
  animationMode = AnimationMode.ENABLED,
}) => {
  const close = useCallback(() => {
    if (!hiding && onClick) {
      onClick();
    }
  }, [hiding, onClick]);

  useEffect(() => {
    Mousetrap.bind('esc', (e) => {
      e.preventDefault();

      close();
    });

    return () => {
      Mousetrap.unbind('esc');
    };
  }, [close]);
  return ReactDOM.createPortal(
    <div
      onClick={close}
      className={classNames(BLOCK_NAME, {
        [`${BLOCK_NAME}--close`]: hiding,
        [`${BLOCK_NAME}--no-animated-open`]: animationMode === AnimationMode.CLOSE,
      })}>
      {children}
    </div>,
    document.getElementById('root') || document.createElement('div'),
  );
};

export { BackgroundBlur };
