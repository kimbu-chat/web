import classNames from 'classnames';
import React from 'react';
import './button.scss';

interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  themed?: boolean;
}

const BLOCK_NAME = 'button';

export const Button: React.FC<IButtonProps> = ({
  children,
  className,
  loading,
  disabled,
  themed,
  ...props
}) => (
  <button
    type="button"
    className={classNames(BLOCK_NAME, { [`${BLOCK_NAME}--loading`]: loading }, className)}
    disabled={loading || disabled}
    {...props}>
    <span className={classNames(`${BLOCK_NAME}__contents`)}>{children}</span>

    <div className={classNames(`${BLOCK_NAME}__loader-wrapper`)}>
      <div
        className={classNames(`${BLOCK_NAME}__loader`, {
          [`${BLOCK_NAME}__loader--themed`]: themed,
        })}>
        <div />
      </div>
    </div>
  </button>
);
