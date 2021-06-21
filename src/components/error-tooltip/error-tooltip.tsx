import React from 'react';

import { ReactComponent as BulbSvg } from '@icons/bulb.svg';

import './error-tooltip.scss';

const BLOCK_NAME = 'error-tooltip';

export const ErrorTooltip: React.FC = ({ children }) => (
  <div className={BLOCK_NAME}>
    <span className={`${BLOCK_NAME}__content`}>
      <BulbSvg className={`${BLOCK_NAME}__content__icon`} />
      <span className={`${BLOCK_NAME}__content__text`}>{children}</span>
    </span>
    <div className={`${BLOCK_NAME}__indicator`} />
  </div>
);
