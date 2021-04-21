import React from 'react';

import './avatar.scss';

interface IAvatarProps {
  src?: string;
  children: string;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<IAvatarProps> = ({ src, children, className, onClick, ...props }) => (
  <>
    {src ? (
      <img
        draggable={false}
        alt={children}
        src={src}
        {...props}
        onClick={onClick}
        className={`avatar ${className || ''}`}
      />
    ) : (
      <div draggable={false} {...props} onClick={onClick} className={`avatar ${className || ''}`}>
        {children}
      </div>
    )}
  </>
);

Avatar.displayName = 'Avatar';
