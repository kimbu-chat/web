import React from 'react';

import classnames from 'classnames';

import { ReactComponent as PlaneVector } from '@assets/plane-vector.svg';
import { ReactComponent as Plane } from '@assets/plane.svg';
import { ReactComponent as SocialSvg } from '@assets/social.svg';

import './social.scss';

const BLOCK_NAME = 'social';

export enum Size {
  BIG = 'big',
  SMALL = 'small',
}

type SocialProps = {
  className?: string;
  planesClassName?: string;
  size?: Size;
};

export const Social: React.FC<SocialProps> = ({
  className,
  planesClassName,
  size = Size.SMALL,
}) => (
  <div className={className}>
    <SocialSvg className={`${BLOCK_NAME}__social--${size}`} />
    <div className={`${BLOCK_NAME}__planes`}>
      <Plane className={classnames(`${BLOCK_NAME}__plane`, `${BLOCK_NAME}__plane--${size}`)} />
      <PlaneVector
        className={classnames(
          `${BLOCK_NAME}__plane-vector`,
          `${BLOCK_NAME}__plane-vector--${size}`,
          planesClassName,
        )}
      />
    </div>
  </div>
);
