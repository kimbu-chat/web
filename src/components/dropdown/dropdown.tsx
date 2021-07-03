import React, { useCallback, useRef, useState } from 'react';

import noop from 'lodash/noop';

import { useOnClickOutside } from '@hooks/use-on-click-outside';
import { ReactComponent as DropDownSvg } from '@icons/arrow.svg';

import './dropdown.scss';

interface IDropdownProps {
  selectedString: string;
  disabled?: boolean;
  options: {
    title: string;
    onClick: () => void;
  }[];
}

export const Dropdown: React.FC<IDropdownProps> = ({ selectedString, options, disabled }) => {
  const [optionsOpened, setOptionsOpened] = useState(false);
  const changeOptionsOpenedStatus = useCallback(() => {
    setOptionsOpened((oldState) => !oldState);
  }, []);
  const closeOptionsOpenedStatus = useCallback(() => {
    setOptionsOpened(() => false);
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, closeOptionsOpenedStatus);

  const clickMethod = disabled ? noop : changeOptionsOpenedStatus;

  return (
    <div ref={dropdownRef} className="dropdown__select-wrapper dropdown__select-wrapper--audio">
      <div
        className={`dropdown__select ${disabled ? 'dropdown__select--disabled' : ''}`}
        onClick={clickMethod}>
        <span>{selectedString}</span>
        <DropDownSvg
          className={`dropdown__icon ${optionsOpened ? 'dropdown__icon--opened' : ''}`}
          viewBox="0 0 48 48"
        />
      </div>
      {optionsOpened && (
        <div className="dropdown__select-block">
          {options.map((option) => (
            <div
              className="dropdown__select-block__option"
              key={option.title}
              onClick={() => {
                option.onClick();
                closeOptionsOpenedStatus();
              }}>
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
