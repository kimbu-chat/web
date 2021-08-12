import React from 'react';

import { ErrorTooltip } from '@components/error-tooltip/error-tooltip';

import './labeled-input.scss';

interface ILabeledInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  containerClassName: string;
  placeholder?: string;
  errorText?: string | null;
}

export const LabeledInput: React.FC<ILabeledInputProps> = ({
  onChange,
  label,
  value,
  containerClassName,
  placeholder,
  errorText,
  ...props
}) => (
  <div className={`labeled-input ${errorText ? 'labeled-input--error' : ''} ${containerClassName}`}>
    <span className="labeled-input__label">{label}</span>
    <input
      autoComplete="new-password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type="text"
      className="labeled-input__input"
      {...props}
    />

    {errorText && <ErrorTooltip>{errorText}</ErrorTooltip>}
  </div>
);
