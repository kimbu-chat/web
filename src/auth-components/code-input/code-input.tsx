import React, { useState, useRef, forwardRef, useEffect } from 'react';

import classnames from 'classnames';

import './code-input.scss';

type CodeInputProps = {
  length?: number;
  onComplete: (code: string) => void;
  loading: boolean;
  error?: boolean;
  resending?: boolean;
};

const DEFAULT_CODE_LENGTH = 4;

const BLOCK_NAME = 'code-input';

export const CodeInput = forwardRef<HTMLDivElement, CodeInputProps>(
  ({ length = DEFAULT_CODE_LENGTH, onComplete, loading, error, resending }, ref) => {
    const [code, setCode] = useState([...Array(length)].map(() => ''));
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      if (resending) {
        setCode([...Array(length)].map(() => ''));
      }
    }, [resending, length]);

    const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
      const num = e.target.value;
      if (/[^0-9]/.test(num)) return;
      const newCode = [...code];
      newCode[slot] = num;
      setCode(newCode);
      if (slot !== length - 1) {
        inputs.current[slot + 1]?.focus();
      }
      if (newCode.every((numb) => numb !== '')) {
        onComplete(newCode.join(''));
      }
    };

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
      if (e.code === 'Backspace' && !code[slot] && slot !== 0) {
        const newCode = [...code];
        newCode[slot - 1] = '';
        setCode(newCode);
        inputs.current[slot - 1]?.focus();
      }
    };

    return (
      <div className={BLOCK_NAME} ref={ref}>
        <div className={`${BLOCK_NAME}__container`}>
          {code.map((num, idx) => (
            <div
              className={classnames(
                `${BLOCK_NAME}__input-container`,
                error && `${BLOCK_NAME}__input-container--error`,
              )}
              key={idx.toString()}>
              <input
                autoComplete="off"
                className={classnames(
                  `${BLOCK_NAME}__input`,
                  !code[idx] && `${BLOCK_NAME}__input--with-border`,
                  error && `${BLOCK_NAME}__input--error`,
                )}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={num}
                autoFocus={!code[0].length && idx === 0}
                readOnly={loading}
                onChange={(e) => processInput(e, idx)}
                onKeyUp={(e) => onKeyUp(e, idx)}
                ref={(reference) => inputs.current.push(reference)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);
