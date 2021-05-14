import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import './add-friend.scss';
import { FadeAnimationWrapper } from '@components';

import { AddFriendModal } from './add-friend-modal/add-friend-modal';

const AddFriend = () => {
  const { t } = useTranslation();

  const [addFriendsModalDisplayed, setAddFriendsModalDisplayed] = useState(false);
  const changeSetAddFriendsModalDisplayedState = useCallback(() => {
    setAddFriendsModalDisplayed((oldState) => !oldState);
  }, [setAddFriendsModalDisplayed]);

  return (
    <>
      <div className="add-friend">
        <div className="add-friend__icon-wrapper">
          <AddContactSvg viewBox="0 0 18 18" />
        </div>

        <h3 className="add-friend__title">{t('addFriend.title')}</h3>
        <h5 className="add-friend__subtitle">{t('addFriend.subtitle')}</h5>

        <button
          onClick={changeSetAddFriendsModalDisplayedState}
          type="button"
          className="add-friend__btn">
          {t('addFriend.add')}
        </button>
      </div>

      <FadeAnimationWrapper isDisplayed={addFriendsModalDisplayed}>
        <AddFriendModal onClose={changeSetAddFriendsModalDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
};

AddFriend.displayName = 'AddFriend';

export { AddFriend };