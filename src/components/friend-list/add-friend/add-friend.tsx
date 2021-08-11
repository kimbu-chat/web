import React from 'react';

import { useTranslation } from 'react-i18next';

import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { Button } from '@shared-components/button';

import { AddFriendModal } from './add-friend-modal/add-friend-modal';

import './add-friend.scss';

const BLOCK_NAME = 'add-friend';

const AddFriend = () => {
  const { t } = useTranslation();

  const [addFriendsModalDisplayed, displayAddFriendsModal, hideAddFriendsModal] =
    useToggledState(false);

  return (
    <>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__icon-wrapper`}>
          <AddContactSvg />
        </div>

        <h3 className={`${BLOCK_NAME}__title`}>{t('addFriend.title')}</h3>
        <h5 className={`${BLOCK_NAME}__subtitle`}>{t('addFriend.subtitle')}</h5>

        <Button onClick={displayAddFriendsModal} type="button" className={`${BLOCK_NAME}__btn`}>
          {t('addFriend.add')}
        </Button>
      </div>

      {addFriendsModalDisplayed && <AddFriendModal onClose={hideAddFriendsModal} />}
    </>
  );
};

AddFriend.displayName = 'AddFriend';

export { AddFriend };
