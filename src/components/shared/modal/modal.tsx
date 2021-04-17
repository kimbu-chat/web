/* eslint-disable react/no-array-index-key */
import React from 'react';

import './modal.scss';

import { ReactComponent as CloseSVG } from '@icons/close.svg';
import { stopPropagation } from '@utils/stop-propagation';

interface IModalProps {
  title: string | JSX.Element;
  content: string | JSX.Element;
  highlightedInContents?: string;
  buttons: (JSX.Element | null | boolean)[];
  closeModal: () => void;
}

const Modal: React.FC<IModalProps> = React.memo(
  ({ title, content, buttons, highlightedInContents, closeModal }) => (
    <div onClick={stopPropagation} className="modal">
      <header className="modal__header">
        <div className="modal__title">{title}</div>
        <CloseSVG onClick={closeModal} viewBox="0 0 25 25" className="modal__close-btn" />
      </header>
      <div className="modal__content">
        {typeof content === 'string' ? (
          <div className="modal__content__text-wrapper">
            {content.split(highlightedInContents || '').map((text, index, arr) => (
              <React.Fragment key={index}>
                <span className="modal__content__text">{text}</span>
                {index < arr.length - 1 && (
                  <span className="modal__content__text modal__content__text--highlighted">
                    {highlightedInContents}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          content
        )}
        <span />
      </div>
      <div className="modal__btn-block">{buttons}</div>
    </div>
  ),
);

Modal.displayName = 'Modal';

export { Modal };
