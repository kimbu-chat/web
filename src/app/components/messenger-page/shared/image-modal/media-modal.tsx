import React, { useState, useCallback, useContext, useEffect } from 'react';

import CloseSVG from '@icons/close.svg';
import ArrowSvg from '@icons/arrow.svg';

import './media-modal.scss';
import { FileType, IPictureAttachment, IVideoAttachment } from '@store/chats/models';
import { BackgroundBlur } from '@components';
import { stopPropagation } from '@utils/stop-propagation';
import { LocalizationContext } from '@contexts';

import Mousetrap from 'mousetrap';

interface IImageModalProps {
  attachmentId: number;
  attachmentsArr: (IPictureAttachment | IVideoAttachment | { url: string; type: FileType; id: number })[];
  onClose: () => void;
}

export const MediaModal: React.FC<IImageModalProps> = React.memo(({ attachmentId, attachmentsArr, onClose }) => {
  const { t } = useContext(LocalizationContext);

  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(attachmentsArr.findIndex(({ id }) => id === attachmentId));

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

  return (
    <BackgroundBlur onClick={onClose}>
      <div className='media-modal'>
        <div className='media-modal__main'>
          <div className='media-modal__controls media-modal__controls--prev'>
            {currentAttachmentIndex > 0 && (
              <button type='button' onClick={goPrev}>
                <ArrowSvg viewBox='0 0 48 48' />
              </button>
            )}
          </div>

          <div className='media-modal__media-wrapper'>
            {attachmentsArr[currentAttachmentIndex].type === FileType.Picture && (
              <img onClick={stopPropagation} src={attachmentsArr[currentAttachmentIndex].url} alt='' className='media-modal__photo' />
            )}
            {attachmentsArr[currentAttachmentIndex].type === FileType.Video && (
              <video preload='metadata' autoPlay controls src={attachmentsArr[currentAttachmentIndex].url} className='media-modal__player' />
            )}
            {attachmentsArr.length !== 1 && (
              <div className='media-modal__position-pointer'>{`(${currentAttachmentIndex + 1} ${t('mediaModal.of')} ${attachmentsArr.length})`}</div>
            )}
          </div>

          <div className='media-modal__controls media-modal__controls--next'>
            {currentAttachmentIndex < attachmentsArr.length - 1 && (
              <button type='button' onClick={goNext}>
                <ArrowSvg viewBox='0 0 48 48' />
              </button>
            )}
          </div>
        </div>

        <button type='button' className='media-modal__close'>
          <CloseSVG viewBox='0 0 24 24' />
        </button>
      </div>
    </BackgroundBlur>
  );
});
