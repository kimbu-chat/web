import React from 'react';

import { AttachmentType } from 'kimbu-models';

import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import './progress-preloader.scss';

interface IProgressPreloader {
  progress: number;
  type: AttachmentType;
  fileName: string;
  uploadedBytes?: number;
  byteSize: number;
}

const BLOCK_NAME = 'progress-preloader';

const ProgressPreloader: React.FC<IProgressPreloader> = ({ progress, type, fileName, uploadedBytes, byteSize }) => (
  <>
    <div
      style={{ width: `${progress}%` }}
      className={`${BLOCK_NAME}__progress ${
        type === AttachmentType.Picture || type === AttachmentType.Video ? `${BLOCK_NAME}__progress--photo` : ''
      }`}
    />
    <div className={`${BLOCK_NAME}__data`}>
      <div className={`${BLOCK_NAME}__title`}>{fileName}</div>
      <div className={`${BLOCK_NAME}__size`}>{`${getRawAttachmentSizeUnit(uploadedBytes || byteSize)}/${getRawAttachmentSizeUnit(byteSize)}}`}</div>
    </div>
  </>
);

export default ProgressPreloader;
