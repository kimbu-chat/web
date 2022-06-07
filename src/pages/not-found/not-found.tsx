import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import NotFoundBackgroundPNG from '@icons/404-bg.png';
import SadSmilePNG from '@icons/sad-emoji.png';
import { HOME_PAGE_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';

import './not-found.scss';

const BLOCK_NAME = 'not-found';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className={BLOCK_NAME}>
      <img alt='Not Found' src={NotFoundBackgroundPNG} className={`${BLOCK_NAME}__bg`} />
      <div className={`${BLOCK_NAME}__wrapper`}>
        <img alt='Not Found' src={SadSmilePNG} className={`${BLOCK_NAME}__svg`} />
        <div className={`${BLOCK_NAME}__title`}>{t('notFound.title')}</div>
        <div className={`${BLOCK_NAME}__description`}>{t('notFound.description')}</div>
        <Link to={HOME_PAGE_PATH}>
          <Button className={`${BLOCK_NAME}__btn`}>{t('notFound.back')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
