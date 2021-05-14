import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import parsePhoneNumberFromString, { parsePhoneNumber } from 'libphonenumber-js';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { PhoneInputGroup, WithBackground, Modal, Avatar, Button } from '@components';
import { IUser } from '@store/common/models';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as CloseSvg } from '@icons/close-x-bold.svg';
import { ChatId } from '@store/chats/chat-id';
import { isFriend } from '@store/friends/selectors';
import { addFriendAction, getUserByPhoneAction } from '@store/friends/actions';
import { addOrUpdateUsers } from '@store/users/actions';

import './add-friend-modal.scss';

interface IAddFriendModalProps {
  onClose: () => void;
}

const AddFriendModal: React.FC<IAddFriendModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const getUserByPhone = useActionWithDeferred(getUserByPhoneAction);
  const addFriend = useActionWithDeferred(addFriendAction);
  const addUsers = useActionWithDeferred(addOrUpdateUsers);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const added = useSelector(isFriend(user?.id));

  const getRequiredUser = useCallback(() => {
    setLoading(true);
    getUserByPhone({ phone })
      .then((result) => {
        setLoading(false);
        if (result) {
          setUser(result);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [phone, setUser, getUserByPhone]);

  const addRequiredUser = useCallback(() => {
    if (user?.id) {
      setLoading(true);
      addUsers({
        users: {
          [user.id]: user,
        },
      });
      addFriend(user?.id).then(() => {
        // setLoading(false);
        setSucess(true);
      });
    }
  }, [user, addUsers, addFriend]);

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
              <Avatar className="add-friends-modal__user__avatar" user={user} />

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
            <Button
              disabled={!parsePhoneNumberFromString(phone)?.isValid()}
              loading={loading}
              key={2}
              type="button"
              className="add-friends-modal__btn add-friends-modal__btn--confirm"
              onClick={getRequiredUser}>
              {t('addFriendModal.find')}
            </Button>
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
            <Button
              key={4}
              type="button"
              loading={loading}
              className="add-friends-modal__btn add-friends-modal__btn--confirm"
              onClick={addRequiredUser}>
              {t('addFriendModal.add')}
            </Button>
          ) : null,
        ]}
      />
    </WithBackground>
  );
};

AddFriendModal.displayName = 'AddFriendModal';

export { AddFriendModal };