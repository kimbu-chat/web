import React, { useCallback, useContext, useState } from 'react';
import AddContactSvg from '@icons/add-users.svg';
import './add-friend-modal.scss';
import { LocalizationContext } from '@contexts';
import { WithBackground, Modal, Avatar, PhoneInputGroup } from '@components';
import { GetUserByPhone } from '@store/friends/features/get-user-by-phone/get-user-by-phone';
import { IUser } from '@store/common/models';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import CloseSvg from '@icons/close-x-bold.svg';
import { getUserInitials } from '@utils/interlocutor-name-utils';
import parsePhoneNumberFromString, { parsePhoneNumber } from 'libphonenumber-js';
import { Link } from 'react-router-dom';
import { ChatId } from '@store/chats/chat-id';
import { AddFriend } from '@store/friends/features/add-friend/add-friend';
import { useSelector } from 'react-redux';
import { isFriend } from '@store/friends/selectors';

interface IAddFriendModalProps {
  onClose: () => void;
}

export const AddFriendModal: React.FC<IAddFriendModalProps> = ({ onClose }) => {
  const { t } = useContext(LocalizationContext);
  const getUserByPhone = useActionWithDeferred(GetUserByPhone.action);
  const addFriend = useActionWithDeferred(AddFriend.action);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [success, setSucess] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const added = useSelector(isFriend(user?.id));

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
  }, [phone, setUser, getUserByPhone]);

  const addRequiredUser = useCallback(() => {
    if (user) {
      addFriend(user).then(() => setSucess(true));
    }
  }, [user, addFriend]);

  const closeError = useCallback(() => {
    setError(false);
  }, [setError]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <AddContactSvg className="add-friends-modal__icon" viewBox="0 0 18 18" />
            <span> {t('addFriendModal.title')} </span>
          </>
        }
        content={
          user ? (
            <div className="add-friends-modal__user">
              <Avatar className="add-friends-modal__user__avatar" src={user.avatar?.previewUrl}>
                {getUserInitials(user)}
              </Avatar>
              <h2 className="add-friends-modal__user__name">{`${user.firstName} ${user.lastName}`}</h2>
              <h4 className="add-friends-modal__user__phone">
                {parsePhoneNumber(user?.phoneNumber).formatInternational()}
              </h4>

              {success && (
                <div className="add-friends-modal__success">
                  <span>{t('addFriendModal.success')}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="add-friends-modal">
              <PhoneInputGroup submitFunction={getRequiredUser} phone={phone} setPhone={setPhone} />
              {error && (
                <div className="add-friends-modal__error">
                  <span>{t('addFriendModal.error')}</span>
                  <button
                    type="button"
                    onClick={closeError}
                    className="add-friends-modal__error__close">
                    <CloseSvg viewBox="0 0 10 10" />
                  </button>
                </div>
              )}
            </div>
          )
        }
        closeModal={onClose}
        buttons={[
          !user ? (
            <button
              key={1}
              type="button"
              className="add-friends-modal__btn add-friends-modal__btn--cancel"
              onClick={onClose}>
              {t('addFriendModal.cancel')}
            </button>
          ) : null,
          !user ? (
            <button
              disabled={!parsePhoneNumberFromString(phone)?.isValid()}
              key={2}
              type="button"
              className="add-friends-modal__btn add-friends-modal__btn--confirm"
              onClick={getRequiredUser}>
              {t('addFriendModal.find')}
            </button>
          ) : null,
          user ? (
            <Link
              key={3}
              className={`add-friends-modal__btn ${
                added ? 'add-friends-modal__btn--confirm' : 'add-friends-modal__btn--cancel'
              }`}
              to={`/chats/${ChatId.from(user.id).id}`}>
              {t('addFriendModal.chat')}
            </Link>
          ) : null,
          user && !added ? (
            <button
              key={4}
              type="button"
              className="add-friends-modal__btn add-friends-modal__btn--confirm"
              onClick={addRequiredUser}>
              {t('addFriendModal.add')}
            </button>
          ) : null,
        ]}
      />
    </WithBackground>
  );
};
