import React from 'react';

import './tooltip.scss';

interface ITooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<ITooltipProps> = ({ children }) => (
  <div className="tooltip">
    <span className="tooltip__content">{children}</span>
    <div className="tooltip__indicator" />
  </div>
);
