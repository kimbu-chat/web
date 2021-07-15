import React, { useState } from 'react';

import classnames from 'classnames';

import { Loader, LoaderSize } from '@components/loader';

import './effect-image.scss';

const BLOCK_NAME = 'effect-image';

export type EffectImageProps = {
  alt: string;
  thumb?: string;
  src: string;
};

interface EffectImageWithIntersecting extends EffectImageProps {
  isIntersecting: boolean;
}

const EffectImage: React.FC<EffectImageWithIntersecting> = ({
  alt,
  thumb,
  src,
  isIntersecting,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {thumb && (
        <>
          <img
            className={classnames(BLOCK_NAME, `${BLOCK_NAME}__thumb`)}
            alt={alt}
            src={thumb}
            style={{
              visibility: isLoaded ? 'hidden' : 'visible',
            }}
          />
          {isIntersecting && !isLoaded && (
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
