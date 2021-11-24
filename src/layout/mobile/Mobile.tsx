import React from 'react';

import { ReactComponent as KimbuText } from '@assets/kimbu.svg';
import { ReactComponent as PlaneVector } from '@assets/plane-vector.svg';
import { ReactComponent as Plane } from '@assets/plane.svg';
import { ReactComponent as Social } from '@assets/social.svg';

import './mobile.scss';

const BLOCK_NAME = 'mobile-layout';

export const Mobile: React.FC = () => (
  <div className={BLOCK_NAME}>
    <KimbuText className={`${BLOCK_NAME}__logo`} />
    <p className={`${BLOCK_NAME}__title`}>Get ready for the new social experience</p>
    <Social />
    <div className={`${BLOCK_NAME}__footer-container`}>
      <Plane className={`${BLOCK_NAME}__plane`} />
      <PlaneVector className={`${BLOCK_NAME}__plane-vector`} />
    </div>
    <span className={`${BLOCK_NAME}__mobile-apps`}>Mobile apps coming soon</span>
    <span className={`${BLOCK_NAME}__copyright`}>{`© ${new Date().getFullYear()} Kimbu`}</span>
  </div>
);
