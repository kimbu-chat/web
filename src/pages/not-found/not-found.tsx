import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from 'react-router-dom';

import './not-found.scss';
import SadSmilePNG from '@icons/sad-emoji.png';
import NotFoundBackgroundPNG from '@icons/404-bg.png';
import { Button } from '@components/button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <img alt="Not Found" src={NotFoundBackgroundPNG} className="not-found__bg" />
      <div className="not-found__wrapper">
        <img alt="Not Found" src={SadSmilePNG} className="not-found__svg" />
        <div className="not-found__title">{t('notFound.title')}</div>
        <div className="not-found__description">{t('notFound.description')}</div>
        <Link to="/chats">
          <Button className="not-found__btn">{t('notFound.back')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
