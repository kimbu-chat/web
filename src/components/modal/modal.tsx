/* eslint-disable react/no-array-index-key */
import './modal.scss';

import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ReactComponent as CloseSVG } from '@icons/close.svg';
import { stopPropagation } from '@utils/stop-propagation';
import { BackgroundBlur } from '@components/with-background';
import { useAnimation } from '@hooks/use-animation';

interface IModalProps {
  title: string | JSX.Element;
  content: string | JSX.Element;
  highlightedInContents?: string;
  buttons: (JSX.Element | null | boolean)[];
  closeModal: () => void;
  unclickableBackground?: boolean;
}

const BLOCK_NAME = 'modal';

const Modal: React.FC<IModalProps> = ({
  title,
  content,
  buttons,
  highlightedInContents,
  closeModal,
  unclickableBackground,
}) => {
  const { rootClass, closeInitiated, animatedClose } = useAnimation(BLOCK_NAME, closeModal);

  const onBackgroundClick = useCallback(() => {
    if (!unclickableBackground) animatedClose();
  }, [animatedClose, unclickableBackground]);

  return (
    <BackgroundBlur hiding={closeInitiated} onClick={onBackgroundClick}>
      <div onClick={stopPropagation} className={rootClass}>
        <header className={classNames(`${BLOCK_NAME}__header`)}>
          <div className={classNames(`${BLOCK_NAME}__title`)}>{title}</div>
          <CloseSVG
            onClick={animatedClose}
            viewBox="0 0 25 25"
            className={classNames(`${BLOCK_NAME}__close-btn`)}
          />
        </header>
        <div className={classNames(`${BLOCK_NAME}__content`)}>
          {typeof content === 'string' ? (
            <div className={classNames(`${BLOCK_NAME}__content__text-wrapper`)}>
              {content.split(highlightedInContents || '').map((text, index, arr) => (
                <React.Fragment key={index}>
                  <span className={classNames(`${BLOCK_NAME}__content__text`)}>{text}</span>
                  {index < arr.length - 1 && (
                    <span
                      className={classNames(
                        `${BLOCK_NAME}__content__text`,
                        `${BLOCK_NAME}__content__text--highlighted`,
                      )}>
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
    </BackgroundBlur>
  );
};

Modal.displayName = 'Modal';

export { Modal };
