import React, { useCallback, useContext, useState } from 'react';
import AddContactSvg from '@icons/add-users.svg';
import { LocalizationContext } from '@contexts';
import './add-friend.scss';
import { FadeAnimationWrapper } from '@components';
import { AddFriendModal } from './add-friend-modal/add-friend-modal';

const AddFriend = () => {
  const { t } = useContext(LocalizationContext);

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

        <button onClick={changeSetAddFriendsModalDisplayedState} type="button" className="add-friend__btn">
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
