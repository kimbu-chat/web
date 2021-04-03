import React, { useCallback, useState } from 'react';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import './add-friend.scss';
import { FadeAnimationWrapper } from '@components/shared';
import { AddFriendModal } from './add-friend-modal/add-friend-modal';

const AddFriend = () => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

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
