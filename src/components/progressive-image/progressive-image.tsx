import React, { memo } from 'react';

import classnames from 'classnames';
import noop from 'lodash/noop';

import { useIsIntersecting, ObserveFn } from '@hooks/use-intersection-observer';

import EffectImage from './effect-image/effect-image';

import type { EffectImageProps } from './effect-image/effect-image';

import './progressive-image.scss';

const BLOCK_NAME = 'progressive-image';

interface ImageContainerProps extends EffectImageProps {
  width: number;
  height: number;
  className?: string;
  progress?: number;
  fileName?: string;
  byteSize?: number;
  uploadedBytes?: number;
  onClick?: () => void;
  onIsVisible?: () => void;
  observeIntersection: ObserveFn;
}

const ProgressiveImage: React.FC<ImageContainerProps> = ({
  width,
  height,
  alt,
  thumb,
  src,
  progress,
  className,
  byteSize,
  fileName,
  uploadedBytes,
  onClick = noop,
  observeIntersection,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const isIntersecting = useIsIntersecting(ref, observeIntersection);

  return (
    <div onClick={onClick} ref={ref} className={classnames(BLOCK_NAME, className)} style={{ height, width }}>
      <EffectImage
        fileName={fileName}
        byteSize={byteSize}
        uploadedBytes={uploadedBytes}
        src={src}
        thumb={thumb}
        alt={alt}
        progress={progress}
        isIntersecting={isIntersecting}
      />
    </div>
  );
};

export default memo(ProgressiveImage);
