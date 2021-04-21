import Mousetrap from 'mousetrap';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './with-background.scss';

interface IBackgroundBlurProps {
  onClick?: () => void;
}

const BackgroundBlur: React.FC<IBackgroundBlurProps> = ({ onClick, children }) => {
  useEffect(() => {
    Mousetrap.bind('esc', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    });

    return () => {
      Mousetrap.unbind('esc');
    };
  }, [onClick]);
  return ReactDOM.createPortal(
    <div onClick={onClick} className="background-blur">
      {children}
    </div>,
    document.getElementById('root') || document.createElement('div'),
  );
};

export interface IWithBackgroundProps {
  onBackgroundClick?: () => void;
}

const WithBackground: React.FC<IWithBackgroundProps> = ({ children, onBackgroundClick }) => (
  <>
    <BackgroundBlur onClick={onBackgroundClick}>{children}</BackgroundBlur>
  </>
);
WithBackground.displayName = 'WithBackground';
BackgroundBlur.displayName = 'BackgroundBlur';

export { WithBackground, BackgroundBlur };
