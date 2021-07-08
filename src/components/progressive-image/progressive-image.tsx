import React from 'react';

import classnames from 'classnames';
import noop from 'lodash/noop';

import useIntersectionObserver from '@hooks/use-intersection-observer';

import Image from './effect-image/effect-image';

import type { EffectImageProps } from './effect-image/effect-image';

import './progressive-image.scss';

const BLOCK_NAME = 'progressive-image';

interface ImageContainerProps extends EffectImageProps {
  width: number;
  height: number;
  onIsVisible?: () => void;
  onClick?: () => void;
  className?: string;
}

const INTERSECTION_THROTTLE_FOR_MEDIA = 350;
const INTERSECTION_MARGIN_FOR_MEDIA = 300;

const ProgressiveImage: React.FC<ImageContainerProps> = ({
  width,
  height,
  onIsVisible = noop,
  onClick = noop,
  alt,
  thumb,
  src,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useIntersectionObserver({
    target: ref,
    throttleMs: INTERSECTION_THROTTLE_FOR_MEDIA,
    margin: INTERSECTION_MARGIN_FOR_MEDIA,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        if (!isVisible) {
          onIsVisible();
          setIsVisible(true);
        }
        observerElement.unobserve(ref.current as Element);
      }
    },
  });

  const aspectRatio = (height / width) * 100;

  return (
    <div
      onClick={onClick}
      ref={ref}
      className={classnames(BLOCK_NAME, className)}
      style={{ paddingBottom: `${aspectRatio}%`, width }}>
      {isVisible && <Image src={src} thumb={thumb} alt={alt} />}
    </div>
  );
};

export default ProgressiveImage;
