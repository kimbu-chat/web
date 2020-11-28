import React from 'react';
import { useSelector } from 'react-redux';
import { getInternetStateSelector } from 'store/internet/selectors';

import './internet-error.scss';

export const InternetError = React.memo(() => {
  const internetState = useSelector(getInternetStateSelector);
  return (
    <>
      {internetState ? (
        <div key={1} hidden />
      ) : (
        <div key={2} className='internet-state internet-state--offline'>
          <p>Internet disconnected</p>
        </div>
      )}
    </>
  );
});
