import React from 'react';

import './avatar.scss';

namespace AvatarNS {
  export interface IProps {
    src?: string;
    children: string;
    className?: string;
    onClick?: () => void;
  }
}

const Avatar = React.memo(({ src, children, className, onClick, ...props }: AvatarNS.IProps) => (
  <>
    {src ? (
      <img alt={children} src={src} {...props} onClick={onClick} className={`avatar ${className || ''}`} />
    ) : (
      <div {...props} onClick={onClick} className={`avatar ${className || ''}`}>
        {children}
      </div>
    )}
  </>
));

Avatar.displayName = 'Avatar';

export { Avatar };
