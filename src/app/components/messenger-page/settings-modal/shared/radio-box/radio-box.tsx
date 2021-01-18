import React from 'react';
import './radio-box.scss';

interface IRadioBoxProps {
  nestingLevel: number;
  onClick: () => void;
  title: string;
  groupName: string;
  defaultChecked?: boolean;
}

export const RadioBox: React.FC<IRadioBoxProps> = React.memo(({ defaultChecked, groupName, title, onClick, nestingLevel }) => (
  <label style={{ marginLeft: `${nestingLevel * 30}px` }} onClick={onClick} className='radio-box'>
    <input defaultChecked={defaultChecked} name={groupName} className='radio-box__radio-input' type='radio' />

    <div className='radio-box__radio-box' />
    <span className='radio-box__title'>{title}</span>
  </label>
));
