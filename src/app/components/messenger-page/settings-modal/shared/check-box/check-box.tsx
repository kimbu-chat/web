import React from 'react';
import './check-box.scss';

import CheckedSvg from '@icons/checked.svg';
import UncheckedSvg from '@icons/unchecked.svg';

interface ICheckBoxProps {
  onClick: () => void;
  isChecked: boolean;
  title: string;
}

export const CheckBox: React.FC<ICheckBoxProps> = React.memo(({ isChecked, title, onClick }) => (
  <div onClick={onClick} className='check-box'>
    <div className='check-box__check-box'>{isChecked ? <CheckedSvg /> : <UncheckedSvg />}</div>
    <span className='check-box__title'>{title}</span>
  </div>
));
