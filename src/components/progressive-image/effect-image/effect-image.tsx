import React, { useState } from 'react';

import classnames from 'classnames';

import './effect-image.scss';

const BLOCK_NAME = 'effect-image';

export type EffectImageProps = {
  alt: string;
  thumb: string;
  src: string;
};

const EffectImage: React.FC<EffectImageProps> = ({ alt, thumb, src }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      <img
        className={classnames(BLOCK_NAME, `${BLOCK_NAME}__thumb`)}
        alt={alt}
        src={thumb}
        style={{
          visibility: isLoaded ? 'hidden' : 'visible',
        }}
      />
      <img
        onLoad={() => {
          setIsLoaded(true);
        }}
        className={classnames(BLOCK_NAME, `${BLOCK_NAME}__full`)}
        style={{ opacity: isLoaded ? 1 : 0 }}
        alt={alt}
        src={src}
      />
    </>
  );
};

export default EffectImage;
