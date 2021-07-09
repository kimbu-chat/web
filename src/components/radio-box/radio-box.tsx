import React from 'react';

import './radio-box.scss';

interface IRadioBoxProps {
  onClick?: () => void;
  content: string | JSX.Element;
  groupName: string;
  defaultChecked?: boolean;
}

const BLOCK_NAME = 'radio-box';

const RadioBox: React.FC<IRadioBoxProps> = ({ defaultChecked, groupName, content, onClick }) => (
  <label onClick={onClick} className={BLOCK_NAME}>
    <input
      defaultChecked={defaultChecked}
      name={groupName}
      className={`${BLOCK_NAME}__radio-input`}
      type="radio"
    />

    <div className={`${BLOCK_NAME}__radio-box-wrapper`}>
      <div className={`${BLOCK_NAME}__radio-box`} />
    </div>

    {typeof content === 'string' ? (
      <span className={`${BLOCK_NAME}__title`}>{content}</span>
    ) : (
      content
    )}
  </label>
);

RadioBox.displayName = 'RadioBox';

export { RadioBox };
