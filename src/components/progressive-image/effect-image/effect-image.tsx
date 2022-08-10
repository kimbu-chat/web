import React, { useState } from 'react';

import classnames from 'classnames';

import { Loader, LoaderSize } from '@components/loader';
import './effect-image.scss';
import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

const BLOCK_NAME = 'effect-image';

export type EffectImageProps = {
  alt?: string;
  thumb?: string;
  src?: string;
  currentAttachment?: INamedAttachment;
};

interface EffectImageWithIntersecting extends EffectImageProps {
  isIntersecting: boolean;
}

const EffectImage: React.FC<EffectImageWithIntersecting> = ({
  alt,
  thumb,
  src,
  isIntersecting,
  currentAttachment,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const isUploaded = (currentAttachment as unknown as IAttachmentToSend)?.progress === 100;

  return (
    <>
      {thumb && (
        <>
          <img
            className={classnames(BLOCK_NAME, `${BLOCK_NAME}__thumb`)}
            alt={alt}
            src={thumb}
            style={{
              filter: `brightness(${isUploaded === false ? '80%' : '100%'})`,
              visibility: isLoaded ? 'hidden' : 'visible',
            }}
          />
          {isIntersecting && isUploaded === false && (
            <div className={`${BLOCK_NAME}__loader`}>
              <Loader size={LoaderSize.MEDIUM} />
            </div>
          )}
        </>
      )}
      {(isIntersecting || !thumb) && (
        <img
          onLoad={() => {
            setIsLoaded(true);
          }}
          className={classnames(BLOCK_NAME, `${BLOCK_NAME}__full`)}
          style={{ opacity: isLoaded || !thumb ? 1 : 0 }}
          alt={alt}
          src={src}
        />
      )}
    </>
  );
};

export default EffectImage;
