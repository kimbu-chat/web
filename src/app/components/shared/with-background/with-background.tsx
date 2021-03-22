import Mousetrap from 'mousetrap';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './with-background.scss';

interface IBackgroundBlurProps {
  onClick: () => void;
}

export const BackgroundBlur: React.FC<IBackgroundBlurProps> = React.memo(({ onClick, children }) => {
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
});
export interface IWithBackgroundProps {
  children?: JSX.Element | boolean;
  onBackgroundClick: () => void;
}

const WithBackground: React.FC<IWithBackgroundProps> = React.memo(({ children, onBackgroundClick }) => (
  <>
    <BackgroundBlur onClick={onBackgroundClick}>{children}</BackgroundBlur>
  </>
));

WithBackground.displayName = 'WithBackground';

export { WithBackground };
