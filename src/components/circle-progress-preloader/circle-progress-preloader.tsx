import React, { useEffect, useRef } from 'react';

import { ReactComponent as ProgressSVG } from '@icons/ic-progress.svg';

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
    const element = progressSvgRef.current;
    let handleMouseEnter: () => void;
    let handleMouseLeave: () => void;

    if (element && !withCross) {
      const cross = element.querySelector<HTMLElement>('.cross');

      if (cross) {
        cross.style.opacity = '0';
        cross.style.transition = 'opacity 0.1s';

        handleMouseEnter = () => {
          cross.style.opacity = '1';
        };
        handleMouseLeave = () => {
          cross.style.opacity = '0';
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    return () => {
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [withCross]);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(76 - (uploadedBytes / byteSize) * 63);
    }
  }, [byteSize, progressSvgRef, uploadedBytes]);

  return <ProgressSVG ref={progressSvgRef} className={`${BLOCK_NAME}__progress-svg`} />;
};
