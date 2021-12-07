import React, { useRef } from 'react';

import { Portal } from '@auth-components/portal';
import { TooltipPopover } from '@auth-components/tooltip-popover';
import { Input, InputProps } from '@components/input';

import './input-with-error.scss';

interface IInputWithErrorProps extends Omit<InputProps, 'ref'> {
  error?: string;
}

const BLOCK_NAME = 'input-with-error';

export const InputWithError: React.FC<IInputWithErrorProps> = ({ error, ...props }) => {
  const inputRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Input {...props} ref={inputRef} error={error} />
      {error && (
        <Portal>
          <TooltipPopover className={`${BLOCK_NAME}__error-tooltip`} tooltipRef={inputRef}>
            {error}
          </TooltipPopover>
        </Portal>
      )}
    </>
  );
};
