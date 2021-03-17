import React, { useCallback, useContext, useState } from 'react';
import AddContactSvg from 'icons/add-users.svg';
import './add-friend-modal.scss';
import { LocalizationContext } from 'app/app';
import { WithBackground, Modal } from 'app/components';
import { PhoneInputGroup } from 'app/components/messenger-page/shared/phone-input-group/phone-input-group';
import { GetUserByPhone } from 'app/store/friends/features/get-user-by-phone/get-user-by-phone';
import { IUser } from 'app/store/common/models';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import CloseSvg from 'icons/close-x.svg';

interface IAddFriendModalProps {
  onClose: () => void;
}

export const AddFriendModal: React.FC<IAddFriendModalProps> = ({ onClose }) => {
  const { t } = useContext(LocalizationContext);
  const getUserByPhone = useActionWithDeferred(GetUserByPhone.action);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const getRequiredUser = useCallback(() => {
    getUserByPhone({ phone })
      .then((result) => {
        if (result) {
          setUser(result);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [phone, setUser]);

  const closeError = useCallback(() => {
    setError(false);
  }, [setError]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <AddContactSvg className='add-friends-modal__icon' viewBox='0 0 18 18' />
            <span> {t('addFriendModal.title')} </span>
          </>
        }
        content={
          user ? (
            <div>{user.firstName}</div>
          ) : (
            <div className='add-friends-modal'>
              <PhoneInputGroup phone={phone} setPhone={setPhone} />
              {error && (
                <div className='add-friends-modal__error'>
                  <span>{t('addFriendModal.error')}</span>
                  <button type='button' onClick={closeError} className='add-friends-modal__error__close'>
                    <CloseSvg />
                  </button>
                </div>
              )}
            </div>
          )
        }
        closeModal={onClose}
        buttons={[
          <button key={1} type='button' className='add-friends-modal__btn add-friends-modal__btn--cancel' onClick={onClose}>
            {t('addFriendModal.cancel')}
          </button>,
          <button key={2} type='button' className='add-friends-modal__btn add-friends-modal__btn--confirm' onClick={getRequiredUser}>
            {t('addFriendModal.find')}
          </button>,
        ]}
      />
    </WithBackground>
  );
};
