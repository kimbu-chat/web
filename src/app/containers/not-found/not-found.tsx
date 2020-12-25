import { LocalizationContext } from 'app/app';
import { BaseBtn } from 'components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './not-found.scss';
import SadSmilePNG from 'icons/sad-emoji.png';
import NotFoundBackgroundPNG from 'icons/404-bg.png';

const NotFound = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className='not-found'>
      <img alt='Not Found' src={NotFoundBackgroundPNG} className='not-found__bg' />
      <div className='not-found__wrapper'>
        <img alt='Not Found' src={SadSmilePNG} className='not-found__svg' />
        <div className='not-found__title'>{t('notFound.title')}</div>
        <div className='not-found__description'>{t('notFound.description')}</div>
        <Link to='/chats'>
          <BaseBtn className='not-found__btn' variant='contained' color='primary' width='auto'>
            {t('notFound.back')}
          </BaseBtn>
        </Link>
      </div>
    </div>
  );
});

export default NotFound;
