import React from 'react';
import ReactDOM from 'react-dom';

namespace BackgroundBlur {
  export interface Props {
    onClick: () => void;
  }
}

const BackgroundBlur = ({ onClick }: BackgroundBlur.Props) => {
  return ReactDOM.createPortal(
    <div onClick={onClick} className="background-blur"></div>,
    document.getElementById('root') || document.createElement('div')
  );
};

export default BackgroundBlur;
