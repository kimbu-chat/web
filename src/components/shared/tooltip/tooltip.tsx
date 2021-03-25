import React from 'react';
import './tooltip.scss';

export const Tooltip: React.FC = ({ children }) => (
  <div className='tooltip'>
    <span className='tooltip__content'>{children}</span>
    <div className='tooltip__indicator' />
  </div>
);
