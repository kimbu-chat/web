import Mousetrap from 'mousetrap';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

namespace BackgroundBlurNS {
  export interface IProps {
    onClick: () => void;
  }
}

export const BackgroundBlur: React.FC<BackgroundBlurNS.IProps> = React.memo(({ onClick, children }) => {
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

namespace WithBackgroundNS {
  export interface IProps {
    children?: JSX.Element | boolean;
    onBackgroundClick: () => void;
  }
}

const WithBackground = React.memo(({ children, onBackgroundClick }: WithBackgroundNS.IProps) => (
  <>
    <BackgroundBlur onClick={onBackgroundClick}>{children}</BackgroundBlur>
  </>
));

WithBackground.displayName = 'WithBackground';

export { WithBackground };
