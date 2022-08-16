import React from 'react';
import './progress-preloader.scss';

interface IProgressPreloader {
  progress: number;
}

const BLOCK_NAME = 'progress-preloader';

const ProgressPreloader: React.FC<IProgressPreloader> = ({ progress }) => (
  <div
    style={{ width: `${progress}%` }}
    className={`${BLOCK_NAME}__progress ${BLOCK_NAME}__progress--photo`}
  />
);

export default ProgressPreloader;
