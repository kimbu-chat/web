import React from 'react';

import classNames from 'classnames';

import Ripple from '@shared-components/ripple';

import './button.scss';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  themed?: boolean;
  ripple?: boolean;
}

const BLOCK_NAME = 'button';

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  loading,
  disabled,
  themed,
  ripple = true,
  ...props
}) => (
  <button
    type="button"
    className={classNames(BLOCK_NAME, { [`${BLOCK_NAME}--loading`]: loading }, className)}
    disabled={loading || disabled}
    {...props}>
    <span className={`${BLOCK_NAME}__contents`}>{children}</span>

    <div className={`${BLOCK_NAME}__loader-wrapper`}>
      <div
        className={classNames(`${BLOCK_NAME}__loader`, {
          [`${BLOCK_NAME}__loader--themed`]: themed,
        })}>
        <div />
      </div>
    </div>
    {ripple && <Ripple />}
  </button>
);
