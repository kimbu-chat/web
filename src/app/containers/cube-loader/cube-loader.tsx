import React from 'react';
import './cube-loader.scss';

export const CubeLoader = React.memo(() => (
  <div id='cube-loader'>
    <div className='caption'>
      <div className='cube-loader'>
        <div className='cube loader-1' />
        <div className='cube loader-2' />
        <div className='cube loader-4' />
        <div className='cube loader-3' />
      </div>
    </div>
  </div>
));
