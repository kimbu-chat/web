import React, { useEffect, useRef } from 'react';

import { ReactComponent as ProgressSVG } from '@icons/ic-progress-circle.svg';
import { ReactComponent as DownloadProgressSVG } from '@icons/ic-progress.svg';

import './circle-progress-preloader.scss';

interface ICircleProgressPreloader {
  byteSize: number;
  uploadedBytes: number;
  withCross?: boolean;
}

const BLOCK_NAME = 'circle-progress-preloader';

export const CircleProgressPreloader: React.FC<ICircleProgressPreloader> = ({ byteSize, uploadedBytes, withCross = false }) => {
  const progressSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(76 - (uploadedBytes / byteSize) * 63);
    }
  }, [byteSize, progressSvgRef, uploadedBytes]);

  return withCross ? (
    <DownloadProgressSVG ref={progressSvgRef} className={`${BLOCK_NAME}__progress-svg`} />
  ) : (
    <ProgressSVG ref={progressSvgRef} className={`${BLOCK_NAME}__progress-svg`} />
  );
};
