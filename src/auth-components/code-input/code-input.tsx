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

type Code = {
  code: string;
  id: number;
};

const DEFAULT_CODE_LENGTH = 4;

const BLOCK_NAME = 'code-input';

const initializeCode = (length: number): Code[] =>
  Array(length)
    .fill('')
    .map((x, i) => ({ code: '', id: i }));

export const CodeInput = forwardRef<HTMLDivElement, CodeInputProps>(
  ({ length = DEFAULT_CODE_LENGTH, onComplete, loading, error, resending }, ref) => {
    const [code, setCode] = useState(initializeCode(length));
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      if (resending) {
        setCode(initializeCode(length));
      }
    }, [resending, length]);

    const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
      const num = e.target.value;
      if (/[^0-9]/.test(num)) return;
      const newCode = [...code];
      newCode[slot].code = num;
      setCode(newCode);
      if (slot !== length - 1) {
        inputs.current[slot + 1]?.focus();
      }
      if (newCode.every(({ code: numb }) => numb !== '')) {
        onComplete(newCode.map((codeElem) => codeElem.code).join(''));
      }
    };

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
      if (e.code === 'Backspace' && !code[slot].code && slot !== 0) {
        const newCode = [...code];
        newCode[slot - 1].code = '';
        setCode(newCode);
        inputs.current[slot - 1]?.focus();
      }
    };

    return (
      <div className={BLOCK_NAME} ref={ref}>
        <div className={`${BLOCK_NAME}__container`}>
          {code.map(({ code: num, id }) => (
            <div
              className={classnames(
                `${BLOCK_NAME}__input-container`,
                error && `${BLOCK_NAME}__input-container--error`,
              )}
              key={id.toString()}>
              <input
                autoComplete="new-password"
                className={classnames(
                  `${BLOCK_NAME}__input`,
                  !code[id] && `${BLOCK_NAME}__input--with-border`,
                  error && `${BLOCK_NAME}__input--error`,
                )}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={num}
                autoFocus={!code[0].code.length && id === 0}
                readOnly={loading}
                onChange={(e) => processInput(e, id)}
                onKeyUp={(e) => onKeyUp(e, id)}
                ref={(reference) => inputs.current.push(reference)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);
