import React from 'react';

import { ReactComponent as KimbuText } from '@assets/kimbu.svg';
import { Social } from '@components/social';

import './mobile.scss';

const BLOCK_NAME = 'mobile-layout';

export const Mobile: React.FC = () => (
  <div className={BLOCK_NAME}>
    <KimbuText className={`${BLOCK_NAME}__logo`} />
    <p className={`${BLOCK_NAME}__title`}>Get ready for the new social experience</p>
    <Social planesClassName={`${BLOCK_NAME}__social-planes`} />
    <div className={`${BLOCK_NAME}__footer-container`}>
      <span className={`${BLOCK_NAME}__mobile-apps`}>Mobile apps coming soon</span>
      <span className={`${BLOCK_NAME}__copyright`}>{`© ${new Date().getFullYear()} Kimbu`}</span>
    </div>
  </div>
);
