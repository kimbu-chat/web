import React, { useState, useCallback, useEffect } from 'react';

import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import { useTranslation } from 'react-i18next';

import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as ArrowSvg } from '@icons/arrow.svg';
import { ReactComponent as CloseSVG } from '@icons/close.svg';
import { BackgroundBlur } from '@shared-components/with-background';
import {
  FileType,
  IPictureAttachment,
  IVideoAttachment,
  IBaseAttachment,
} from '@store/chats/models';
import { stopPropagation } from '@utils/stop-propagation';

import './media-modal.scss';

interface IImageModalProps {
  attachmentId: number;
  attachmentsArr: (
    | IPictureAttachment
    | IVideoAttachment
    | IBaseAttachment
    | { url: string; type: FileType; id: number }
  )[];
  onClose: () => void;
}

const BLOCK_NAME = 'media-modal';

export const MediaModal: React.FC<IImageModalProps> = ({
  attachmentId,
  attachmentsArr,
  onClose,
}) => {
  const { t } = useTranslation();

  const { rootClass, closeInitiated, animatedClose } = useAnimation(BLOCK_NAME, onClose);

  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(
    attachmentsArr.findIndex(({ id }) => id === attachmentId),
  );

  const goNext = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentAttachmentIndex((prev) => (prev < attachmentsArr.length - 1 ? prev + 1 : prev));
    },
    [setCurrentAttachmentIndex, attachmentsArr.length],
  );

  const goPrev = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentAttachmentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    },
    [setCurrentAttachmentIndex],
  );

  useEffect(() => {
    Mousetrap.bind('left', goPrev);
    Mousetrap.bind('right', goNext);

    return () => {
      Mousetrap.unbind('left');
      Mousetrap.unbind('right');
    };
  }, [goNext, goPrev]);

  const currentAttachment = attachmentsArr[currentAttachmentIndex];

  return (
    <BackgroundBlur hiding={closeInitiated} onClick={animatedClose}>
      <div className={rootClass}>
        <div className={`${BLOCK_NAME}__main`}>
          <div className={classNames(`${BLOCK_NAME}__controls`, `${BLOCK_NAME}__controls--prev`)}>
            {currentAttachmentIndex > 0 && (
              <button type="button" onClick={goPrev}>
                <ArrowSvg viewBox="0 0 48 48" />
              </button>
            )}
          </div>

          <div className={`${BLOCK_NAME}__media-wrapper`}>
            {(currentAttachment.type === FileType.Picture ||
              (currentAttachment as IBaseAttachment)?.fileName.endsWith('.gif')) && (
              <img
                onClick={stopPropagation}
                src={currentAttachment.url}
                alt=""
                className={`${BLOCK_NAME}__photo`}
              />
            )}
            {currentAttachment.type === FileType.Video && (
              <video
                preload="metadata"
                autoPlay
                controls
                src={currentAttachment.url}
                className={`${BLOCK_NAME}__player`}
              />
            )}
            {attachmentsArr.length !== 1 && (
              <div className={`${BLOCK_NAME}__position-pointer`}>
                {`(${currentAttachmentIndex + 1} ${t('mediaModal.of')} ${attachmentsArr.length})`}
              </div>
            )}
          </div>

          <div className={classNames(`${BLOCK_NAME}__controls`, `${BLOCK_NAME}__controls--next`)}>
            {currentAttachmentIndex < attachmentsArr.length - 1 && (
              <button type="button" onClick={goNext}>
                <ArrowSvg viewBox="0 0 48 48" />
              </button>
            )}
          </div>
        </div>

        <button className={`${BLOCK_NAME}__close`} type="button">
          <CloseSVG viewBox="0 0 24 24" />
        </button>
      </div>
    </BackgroundBlur>
  );
};

MediaModal.displayName = 'MediaModal';
