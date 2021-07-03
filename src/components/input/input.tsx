import React, { forwardRef, useCallback } from 'react';

import classnames from 'classnames';

import './input.scss';

interface InputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  error?: string;
  label?: string;
  prefix?: string;
  onChange: (val: string) => void;
}

const BLOCK_NAME = 'input-component';

export const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ error, label, className, prefix, onChange, ...props }, ref) => {
    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );

    return (
      <div className={classnames(BLOCK_NAME, className)} ref={ref}>
        {label && (
          <label
            className={classnames(`${BLOCK_NAME}__label`, error && `${BLOCK_NAME}__label--error`)}
            htmlFor="input">
            {label}
          </label>
        )}
        <div
          className={classnames(
            `${BLOCK_NAME}__input-container`,
            error && `${BLOCK_NAME}__input-container--error`,
          )}>
          {prefix}
          <input
            className={classnames(`${BLOCK_NAME}__input`, error && `${BLOCK_NAME}__input--error`)}
            id="input"
            onChange={onInputChange}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
