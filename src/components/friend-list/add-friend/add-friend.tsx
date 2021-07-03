import React from 'react';

import { useTranslation } from 'react-i18next';

import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';

import { AddFriendModal } from './add-friend-modal/add-friend-modal';

import './add-friend.scss';

const AddFriend = () => {
  const { t } = useTranslation();

  const [addFriendsModalDisplayed, displayAddFriendsModal, hideAddFriendsModal] =
    useToggledState(false);

  return (
    <>
      <div className="add-friend">
        <div className="add-friend__icon-wrapper">
          <AddContactSvg viewBox="0 0 18 18" />
        </div>

        <h3 className="add-friend__title">{t('addFriend.title')}</h3>
        <h5 className="add-friend__subtitle">{t('addFriend.subtitle')}</h5>

        <button onClick={displayAddFriendsModal} type="button" className="add-friend__btn">
          {t('addFriend.add')}
        </button>
      </div>

      {addFriendsModalDisplayed && <AddFriendModal onClose={hideAddFriendsModal} />}
    </>
  );
};

AddFriend.displayName = 'AddFriend';

export { AddFriend };
