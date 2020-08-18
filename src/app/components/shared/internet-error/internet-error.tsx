import React from 'react';
import { useSelector } from 'react-redux';
import { getInternetStateSelector } from 'app/store/internet/selectors';

import './internet-error.scss';

const InternetError = () => {
	const internetState = useSelector(getInternetStateSelector);
	return (
		<React.Fragment>
			{internetState ? (
				<div key={1} className='internet-state internet-state--online'>
					<p>Internet connected</p>
				</div>
			) : (
				<div key={2} className='internet-state internet-state--offline'>
					<p>Internet disconnected</p>
				</div>
			)}
		</React.Fragment>
	);
};

export default InternetError;
