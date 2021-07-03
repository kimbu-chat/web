/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';

import { BackgroundBlur } from '@components/with-background';
import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as CloseSVG } from '@icons/close.svg';
import { stopPropagation } from '@utils/stop-propagation';

import './modal.scss';

interface IModalProps {
  children: string | JSX.Element;
  closeModal: () => void;
  unclickableBackground?: boolean;
}

const BLOCK_NAME = 'modal';

const MainModal = ({ children, closeModal, unclickableBackground }: IModalProps) => {
  const { rootClass, closeInitiated, animatedClose } = useAnimation(BLOCK_NAME, closeModal);

  const onBackgroundClick = useCallback(() => {
    if (!unclickableBackground) animatedClose();
  }, [animatedClose, unclickableBackground]);

  return (
    <BackgroundBlur hiding={closeInitiated} onClick={onBackgroundClick}>
      <div onClick={stopPropagation} className={rootClass}>
        <CloseSVG
          onClick={animatedClose}
          viewBox="0 0 25 25"
          className={`${BLOCK_NAME}__close-btn`}
        />
        <div className={`${BLOCK_NAME}__content`}>{children}</div>
      </div>
    </BackgroundBlur>
  );
};

const Header: React.FC = ({ children }) => (
  <header className={`${BLOCK_NAME}__header`}>
    <div className={`${BLOCK_NAME}__title`}>{children}</div>
  </header>
);

const Modal = Object.assign(MainModal, {
  Header,
});

export { Modal };
