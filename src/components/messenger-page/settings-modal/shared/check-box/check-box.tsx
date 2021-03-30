import React, { ReactElement } from 'react';
import './check-box.scss';

import CheckedSvg from '@icons/checked.svg';

interface ICheckBoxProps {
  onClick: () => void;
  isChecked: boolean;
  disabled?: boolean;
  title: string;
  className?: string;
}

function renderCheckboxView(isChecked: boolean, disabled: boolean | undefined): ReactElement {
  if (disabled) {
    return <div className="check-box__disabled" />;
  }

  if (isChecked) {
    return <CheckedSvg className="check-box__checked" />;
  }

  return <div className="check-box__unchecked" />;
}

export const CheckBox: React.FC<ICheckBoxProps> = React.memo(
  ({ isChecked, className, title, onClick, disabled }) => (
    <div onClick={disabled ? undefined : onClick} className={`check-box ${className || ''}`}>
      {renderCheckboxView(isChecked, disabled)}
      <span className="check-box__title">{title}</span>
    </div>
  ),
);
