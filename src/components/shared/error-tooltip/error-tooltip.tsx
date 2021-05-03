import React from 'react';
import { ReactComponent as BulbSvg } from '@icons/bulb.svg';

import './error-tooltip.scss';

export const ErrorTooltip: React.FC = ({ children }) => (
  <div className="error-tooltip">
    <span className="error-tooltip__content">
      <BulbSvg className="error-tooltip__content__icon" />
      <span className="error-tooltip__content__text">{children}</span>
    </span>
    <div className="error-tooltip__indicator" />
  </div>
);
