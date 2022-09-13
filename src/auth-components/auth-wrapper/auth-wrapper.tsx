import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Social, Size } from '@components/social';

import { ReactComponent as KimbuText } from '../../assets/kimbu.svg';

import { ReactComponent as CurvedShape } from './curvedShape.svg';
import { ReactComponent as Vector1 } from './vector1.svg';
import { ReactComponent as Vector2 } from './vector2.svg';
import { ReactComponent as Vector3 } from './vector3.svg';

import './auth-wrapper.scss';

const BLOCK_NAME = 'auth-wrapper';

interface IAuthWrapper {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<IAuthWrapper> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className={BLOCK_NAME}>
      <CurvedShape className={`${BLOCK_NAME}__curved-shape`} />
      <Social size={Size.BIG} className={`${BLOCK_NAME}__social`} />
      <Vector1 className={`${BLOCK_NAME}__vector1`} />
      <Vector2 className={`${BLOCK_NAME}__vector2`} />
      <Vector3 className={`${BLOCK_NAME}__vector3`} />
      <Link to="/login">
        <KimbuText className={`${BLOCK_NAME}__text-logo`} />
      </Link>
      <div className={`${BLOCK_NAME}__slogan-block`}>
        <p className={`${BLOCK_NAME}__slogan`}>{t('loginPage.connect')}</p>
        <p className={`${BLOCK_NAME}__slogan`}>{t('loginPage.chat_involve')}</p>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
