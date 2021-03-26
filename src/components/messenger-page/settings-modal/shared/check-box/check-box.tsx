import React from 'react';
import './check-box.scss';

import CheckedSvg from '@icons/checked.svg';

interface ICheckBoxProps {
  onClick: () => void;
  isChecked: boolean;
  title: string;
  className?: string;
}

export const CheckBox: React.FC<ICheckBoxProps> = React.memo(
  ({ isChecked, className, title, onClick }) => (
    <div onClick={onClick} className={`check-box ${className || ''}`}>
      <div className="check-box__check-box">{isChecked && <CheckedSvg />}</div>
      <span className="check-box__title">{title}</span>
    </div>
  ),
);
