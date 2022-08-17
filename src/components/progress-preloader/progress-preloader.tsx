import React from 'react';

import { AttachmentType } from 'kimbu-models';

import './progress-preloader.scss';

interface IProgressPreloader {
  progress: number;
  type: AttachmentType;
}

const BLOCK_NAME = 'progress-preloader';

const ProgressPreloader: React.FC<IProgressPreloader> = ({ progress, type }) => (
  <div
    style={{ width: `${progress}%` }}
    className={`${BLOCK_NAME}__progress ${
      type === AttachmentType.Picture || type === AttachmentType.Video
        ? `${BLOCK_NAME}__progress--photo`
        : ''
    }`}
  />
);

export default ProgressPreloader;
