import React, { ReactElement } from 'react';
import './check-box.scss';

import { ReactComponent as CheckedSvg } from '@icons/checked.svg';
import classNames from 'classnames';

interface ICheckBoxProps {
  onClick: () => void;
  isChecked: boolean;
  disabled?: boolean;
  loading?: boolean;
  title: string;
  className?: string;
}

const BLOCK_NAME = 'check-box';

function renderCheckboxView(isChecked: boolean, disabled: boolean | undefined): ReactElement {
  return (
    <>
      {disabled && <div className={classNames(`${BLOCK_NAME}__disabled`)} />}
      {isChecked && <CheckedSvg className={classNames(`${BLOCK_NAME}__checked`)} />}

      {!disabled && !isChecked && <div className={classNames(`${BLOCK_NAME}__unchecked`)} />}
    </>
  );
}

export const CheckBox: React.FC<ICheckBoxProps> = ({
  isChecked,
  className,
  title,
  onClick,
  disabled,
  loading,
}) => (
  <div onClick={disabled ? undefined : onClick} className={`check-box ${className || ''}`}>
    {renderCheckboxView(isChecked, disabled)}
    <span className={classNames(`${BLOCK_NAME}__title`)}>{title}</span>

    {loading && (
      <div className={classNames(`${BLOCK_NAME}__loader-wrapper`)}>
        <div className={classNames(`${BLOCK_NAME}__loader`)}>
          <div />
        </div>
      </div>
    )}
  </div>
);
