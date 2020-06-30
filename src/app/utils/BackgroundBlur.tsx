import React from 'react';
import ReactDOM from 'react-dom';

const BackgroundBlur = () => {
  return ReactDOM.createPortal(<div className="background-blur"></div>, document.createElement('div'));
};

export default BackgroundBlur;
