/* eslint-disable react/no-array-index-key */
import React from 'react';

import './modal.scss';

import CloseSVG from 'icons/ic-close.svg';
import { stopPropagation } from 'app/utils/stop-propagation';
import { BaseBtn, BaseBtnNS } from '../base-btn/base-btn';

namespace ModalNS {
  export interface IButton extends BaseBtnNS.IProps {
    position: 'left' | 'right';
  }
  export interface IProps {
    title: string | JSX.Element;
    contents: string | JSX.Element;
    highlightedInContents?: string;
    buttons: ModalNS.IButton[];
    closeModal: () => void;
  }
}

export const Modal = React.memo(({ title, contents, buttons, highlightedInContents, closeModal }: ModalNS.IProps) => {
  const leftBtns: ModalNS.IButton[] = [];
  const rightBtns: ModalNS.IButton[] = [];

  buttons.forEach((btn) => {
    if (btn.position === 'left') {
      leftBtns.push(btn);
    }

    if (btn.position === 'right') {
      rightBtns.push(btn);
    }
  });

  return (
    <div onClick={stopPropagation} className='modal'>
      <header className='modal__header'>
        <div className='modal__title'>{title}</div>
        <CloseSVG onClick={closeModal} viewBox='0 0 25 25' className='modal__close-btn' />
      </header>
      <div className='modal__contents'>
        {typeof contents === 'string'
          ? contents.split(highlightedInContents || '').map((text, index, arr) => (
              <React.Fragment key={index}>
                <span className='modal__contents__text'>{text}</span>
                {index < arr.length - 1 && <span className='modal__contents__text modal__contents__text--highlighted'>{highlightedInContents}</span>}
              </React.Fragment>
            ))
          : contents}
        <span />
      </div>
      <div className='modal__btn-block'>
        {leftBtns.map((btn, index, arr) => (
          <BaseBtn key={index} {...btn} style={{ marginRight: index === arr.length - 1 ? 'auto' : '0', ...btn.style }} />
        ))}

        {rightBtns.map((btn, index) => (
          <BaseBtn key={index} {...btn} style={{ marginLeft: index === 0 ? 'auto' : '0', ...btn.style }} />
        ))}
      </div>
    </div>
  );
});
