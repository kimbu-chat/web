import React from 'react';
import './labeled-input.scss';
import { ReactComponent as BulbSvg } from '@icons/bulb.svg';

interface ILabeledInputProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  containerClassName: string;
  placeholder?: string;
  errorText?: string;
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

    {errorText && (
      <div className="labeled-input__error">
        <BulbSvg className="labeled-input__error__icon" viewBox="0 0 24 24" />
        <span className="labeled-input__error__text">{errorText}</span>
      </div>
    )}
  </div>
);
