import React from 'react';

import './internet-error.scss';

export const InternetError = React.memo(() => (
  <div className='internet-error'>
    <p>Internet disconnected</p>
  </div>
));
