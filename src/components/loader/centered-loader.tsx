import React from 'react';

import { Loader, LoaderProps } from './loader';

import './loader.scss';

const BLOCK_NAME = 'loader';

export const CenteredLoader: React.FC<LoaderProps> = ({ size }) => (
  <div className={`${BLOCK_NAME}__centered`}>
    <Loader size={size} />
  </div>
);
