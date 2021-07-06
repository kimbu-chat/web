import React, { useCallback } from 'react';

import classNames from 'classnames';

import { BackgroundBlur } from '@components/with-background';
import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as CloseSVG } from '@icons/close.svg';
import { stopPropagation } from '@utils/stop-propagation';

import './modal.scss';
import { AnimationMode } from '../with-background/with-background';

interface IModalProps {
  children: string | JSX.Element;
  closeModal: () => void;
  unclickableBackground?: boolean;
  animationMode?: AnimationMode;
}

const BLOCK_NAME = 'modal';

const MainModal = ({
  children,
  closeModal,
  unclickableBackground,
  animationMode = AnimationMode.ENABLED,
}: IModalProps) => {
  const { rootClass, closeInitiated, animatedClose } = useAnimation(BLOCK_NAME, closeModal);

  const onBackgroundClick = useCallback(() => {
    if (!unclickableBackground) animatedClose();
  }, [animatedClose, unclickableBackground]);

  return (
    <BackgroundBlur
      animationMode={animationMode}
      hiding={closeInitiated}
      onClick={onBackgroundClick}>
      <div
        onClick={stopPropagation}
        className={classNames(rootClass, {
          [`${BLOCK_NAME}--no-animated-open`]: animationMode === AnimationMode.CLOSE,
        })}>
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
