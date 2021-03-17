import React, { useContext } from 'react';
import AddContactSvg from 'icons/add-users.svg';
import { LocalizationContext } from 'app/app';
import './add-friend.scss';

const AddFriend = () => {
  const { t } = useContext(LocalizationContext);

  return (
    <div className='add-friend'>
      <div className='add-friend__icon-wrapper'>
        <AddContactSvg viewBox='0 0 18 18' />
      </div>

      <h3 className='add-friend__title'>{t('addFriend.title')}</h3>
      <h5 className='add-friend__subtitle'>{t('addFriend.subtitle')}</h5>

      <button type='button' className='add-friend__btn'>
        {t('addFriend.add')}
      </button>
    </div>
  );
};

AddFriend.displayName = 'AddFriend';

export { AddFriend };
