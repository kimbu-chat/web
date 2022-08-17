import React from 'react';

import { AttachmentType } from 'kimbu-models';

import { LoaderSize } from '@components/loader';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import './progress-preloader.scss';

interface IProgressPreloader {
  progress?: number;
  type: AttachmentType;
  fileName?: string;
  uploadedBytes?: number;
  byteSize?: number;
  size?: LoaderSize.SMALL | LoaderSize.LARGE;
}

const BLOCK_NAME = 'progress-preloader';

const ProgressPreloader: React.FC<IProgressPreloader> = ({ progress, type, fileName, uploadedBytes, byteSize, size = LoaderSize.SMALL }) => {
  const byteSizeClassName = `${BLOCK_NAME}__size ${BLOCK_NAME}__size--${size}`;
  const fileNameClassName = `${BLOCK_NAME}__title ${BLOCK_NAME}__title--${size}`;

  return (
    <>
      <div
        style={{ width: `${progress}%` }}
        className={`${BLOCK_NAME}__progress ${
          type === AttachmentType.Picture || type === AttachmentType.Video ? `${BLOCK_NAME}__progress--photo` : ''
        }`}
      />
      <div className={`${BLOCK_NAME}__data`}>
        <div className={fileNameClassName}>{fileName}</div>
        <div className={byteSizeClassName}>
          {byteSize && `${getRawAttachmentSizeUnit(uploadedBytes || byteSize)}/${getRawAttachmentSizeUnit(byteSize)}`}
        </div>
      </div>
    </>
  );
};

export default ProgressPreloader;
