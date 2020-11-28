import React, { useEffect, useRef } from 'react';
import './circular-progress.scss';

import CircularProgressSVG from 'icons/ic-circular-progress.svg';

namespace CircularProgressNS {
  export interface Props {
    progress: number;
  }
}

export const CircularProgress: React.FC<CircularProgressNS.Props> = React.memo(({ progress }) => {
  const progressSvgRef = useRef<SVGElement>(null);

  useEffect(() => {
    if (progressSvgRef.current) {
      progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(76 - (progress / 100) * 64);
    }
  }, [progress, progressSvgRef]);

  return <CircularProgressSVG ref={progressSvgRef} className='circular-progress' viewBox='0 0 25 25' />;
});
