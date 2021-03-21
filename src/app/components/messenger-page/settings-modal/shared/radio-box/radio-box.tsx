import React from 'react';
import './radio-box.scss';

interface IRadioBoxProps {
  onClick: () => void;
  title: string;
  groupName: string;
  defaultChecked?: boolean;
}

export const RadioBox: React.FC<IRadioBoxProps> = React.memo(({ defaultChecked, groupName, title, onClick }) => (
  <label onClick={onClick} className='radio-box'>
    <input defaultChecked={defaultChecked} name={groupName} className='radio-box__radio-input' type='radio' />

    <div className='radio-box__radio-box-wrapper'>
      <div className='radio-box__radio-box' />
    </div>

    <span className='radio-box__title'>{title}</span>
  </label>
));
