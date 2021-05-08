import React, { useCallback, useState } from 'react';
import { ReactComponent as UploadSvg } from '@icons/upload.svg';
import './drag-indicator.scss';
import classNames from 'classnames';

const BLOCK_NAME = 'drag-indicator';

export const DragIndicator = () => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const { relatedTarget: toTarget } = e;

    if (
      !(toTarget as HTMLDivElement)?.matches(
        '.messenger__chat-send, .messenger__chat-send *, .chat-data__chat-data, .chat-data__chat-data *, .messenger__info, .messenger__info *',
      )
    ) {
      setIsDragging(false);
    }
  }, []);

  return (
    <div
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      className={classNames(BLOCK_NAME)}>
      <div
        className={classNames(`${BLOCK_NAME}__dashed`, {
          [`${BLOCK_NAME}__dashed--over`]: isDragging,
        })}>
        <div className={classNames(`${BLOCK_NAME}__upload`)}>
          <div className={classNames(`${BLOCK_NAME}__icon-wrapper`)}>
            <UploadSvg className="drag-indicator__icon" />
          </div>
          <h3 className={classNames(`${BLOCK_NAME}__title`)}>Drop to attach</h3>
          <h4 className={classNames(`${BLOCK_NAME}__info`)}>Maximum size: 10 MB</h4>
        </div>
      </div>
    </div>
  );
};
