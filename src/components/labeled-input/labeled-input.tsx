import React from 'react';

import { ErrorTooltip } from '../error-tooltip/error-tooltip';
import './labeled-input.scss';

interface ILabeledInputProps {
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
}) => (
  <div className={`labeled-input ${errorText ? 'labeled-input--error' : ''} ${containerClassName}`}>
    <span className="labeled-input__label">{label}</span>
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type="text"
      className="labeled-input__input"
    />

    {errorText && <ErrorTooltip>{errorText}</ErrorTooltip>}
  </div>
);