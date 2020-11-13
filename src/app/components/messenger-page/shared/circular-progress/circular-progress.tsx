import React, { useEffect, useRef } from 'react';
import './circular-progress.scss';

import CircularProgressSVG from 'app/assets/icons/ic-circular-progress.svg';

namespace CircularProgress {
	export interface Props {
		progress: number;
	}
}

const CircularProgress: React.FC<CircularProgress.Props> = ({ progress }) => {
	const progressSvgRef = useRef<SVGElement>(null);

	useEffect(() => {
		if (progressSvgRef.current) {
			progressSvgRef.current.querySelectorAll('circle')[1].style.strokeDashoffset = String(
				76 - (progress / 100) * 64,
			);
		}
	}, [progress, progressSvgRef]);

	return <CircularProgressSVG ref={progressSvgRef} className={'circular-progress'} viewBox='0 0 25 25' />;
};

export default React.memo(CircularProgress);