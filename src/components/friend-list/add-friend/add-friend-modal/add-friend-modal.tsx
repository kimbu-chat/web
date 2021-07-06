import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import parsePhoneNumberFromString, { parsePhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { Button } from '@components/button';
import { Modal } from '@components/modal';
import { PhoneInputGroup } from '@components/phone-input-group';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { ReactComponent as CloseSvg } from '@icons/close-x-bold.svg';
import { ChatId } from '@store/chats/chat-id';
import { IUser } from '@store/common/models';
import { addFriendAction, getUserByPhoneAction } from '@store/friends/actions';
import { isFriend } from '@store/friends/selectors';
import { addOrUpdateUsers } from '@store/users/actions';

import './add-friend-modal.scss';

interface IAddFriendModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'add-friends-modal';

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
    <Modal closeModal={onClose}>
      <>
        <Modal.Header>
          <>
            <AddContactSvg className={`${BLOCK_NAME}__icon`} viewBox="0 0 18 18" />
            <span> {t('addFriendModal.title')} </span>
          </>
        </Modal.Header>
        {user ? (
          <div className={`${BLOCK_NAME}__user`}>
            <Avatar className={`${BLOCK_NAME}__user__avatar`} size={80} user={user} />

            <h2 className={`${BLOCK_NAME}__user__name`}>{`${user.firstName} ${user.lastName}`}</h2>
            <h4 className={`${BLOCK_NAME}__user__phone`}>
              {parsePhoneNumber(user?.phoneNumber).formatInternational()}
            </h4>

            {success && (
              <div className={`${BLOCK_NAME}__success`}>
                <span>{t('addFriendModal.success')}</span>
              </div>
            )}

            <div className={`${BLOCK_NAME}__btn-block`}>
              <Link
                className={classNames(`${BLOCK_NAME}__btn`, {
                  [`${BLOCK_NAME}__btn--confirm`]: added,
                  [`${BLOCK_NAME}__btn--cancel`]: !added,
                })}
                to={`/im/${ChatId.from(user.id).id}`}>
                {t('addFriendModal.chat')}
              </Link>
              {!added && (
                <Button
                  type="button"
                  loading={loading}
                  className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}
                  onClick={addRequiredUser}>
                  {t('addFriendModal.add')}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={BLOCK_NAME}>
            <PhoneInputGroup submitFunction={getRequiredUser} phone={phone} setPhone={setPhone} />
            {error && (
              <div className={`${BLOCK_NAME}__error`}>
                <span>{t('addFriendModal.error')}</span>
                <button
                  type="button"
                  onClick={closeError}
                  className={`${BLOCK_NAME}__error__close`}>
                  <CloseSvg viewBox="0 0 10 10" />
                </button>
              </div>
            )}
            <div className={`${BLOCK_NAME}__btn-block`}>
              <button
                type="button"
                className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
                onClick={onClose}>
                {t('addFriendModal.cancel')}
              </button>
              <Button
                disabled={!parsePhoneNumberFromString(phone)?.isValid()}
                loading={loading}
                type="button"
                className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}
                onClick={getRequiredUser}>
                {t('addFriendModal.find')}
              </Button>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

AddFriendModal.displayName = 'AddFriendModal';

export { AddFriendModal };
