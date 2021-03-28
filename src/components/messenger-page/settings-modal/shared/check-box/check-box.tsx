import React from 'react';
import './check-box.scss';

import CheckedSvg from '@icons/checked.svg';

interface ICheckBoxProps {
  onClick: () => void;
  isChecked: boolean;
  disabled?: boolean;
  title: string;
  className?: string;
}

export const CheckBox: React.FC<ICheckBoxProps> = React.memo(({ isChecked, className, title, onClick, disabled }) => (
  <div onClick={disabled ? undefined : onClick} className={`check-box ${className || ''}`}>
    {disabled ? <div className='check-box__disabled' /> : isChecked ? <CheckedSvg className='check-box__checked' /> : <div className='check-box__unchecked' />}
    <span className='check-box__title'>{title}</span>
  </div>
));
