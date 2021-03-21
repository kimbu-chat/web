import React from 'react';
import './radio-box.scss';

interface IRadioBoxProps {
  onClick: () => void;
  content: string | JSX.Element;
  groupName: string;
  defaultChecked?: boolean;
}

export const RadioBox: React.FC<IRadioBoxProps> = React.memo(({ defaultChecked, groupName, content, onClick }) => (
  <label onClick={onClick} className='radio-box'>
    <input defaultChecked={defaultChecked} name={groupName} className='radio-box__radio-input' type='radio' />

    <div className='radio-box__radio-box-wrapper'>
      <div className='radio-box__radio-box' />
    </div>

    {typeof content === 'string' ? <span className='radio-box__title'>{content}</span> : content}
  </label>
));
