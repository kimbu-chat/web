import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { IGetUserByPhoneNumberQueryResult } from 'kimbu-models';
import parsePhoneNumberFromString, { parsePhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Avatar } from '@components/avatar';
import { IModalChildrenProps, Modal } from '@components/modal';
import { PhoneInputGroup } from '@components/phone-input-group';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { ReactComponent as CloseSvg } from '@icons/close-x-bold.svg';
import { INSTANT_MESSAGING_CHAT_PATH } from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { ChatId } from '@store/chats/chat-id';
import { addFriendAction, getUserByPhoneAction } from '@store/friends/actions';
import { isFriend } from '@store/friends/selectors';
import { replaceInUrl } from '@utils/replace-in-url';
import './add-friend-modal.scss';

interface IAddFriendModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'add-friends-modal';

const InitialAddFriendModal: React.FC<IAddFriendModalProps & IModalChildrenProps> = ({
  animatedClose,
}) => {
  const { t } = useTranslation();
  const getUserByPhone = useActionWithDeferred(getUserByPhoneAction);
  const addFriend = useActionWithDeferred(addFriendAction);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foundResult, setFoundResult] = useState<IGetUserByPhoneNumberQueryResult | null>(null);
  const [success, setSuccess] = useState(false);

  const isUserWasAdded = useSelector(isFriend(foundResult?.user?.id));

  const getRequiredUser = useCallback(() => {
    setLoading(true);
    getUserByPhone<IGetUserByPhoneNumberQueryResult>({ phone })
      .then((result) => {
        setLoading(false);
        setFoundResult(result);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [phone, setFoundResult, getUserByPhone]);

  const addRequiredUser = useCallback(() => {
    if (foundResult) {
      const { user } = foundResult;
      setLoading(true);
      addFriend(user).then(() => {
        setLoading(false);
        setSuccess(true);
      });
    }
  }, [foundResult, addFriend]);

  const closeError = useCallback(() => {
    setError(false);
  }, [setError]);

  return (
    <>
      <Modal.Header>
        <>
          <AddContactSvg className={`${BLOCK_NAME}__icon`} />
          <span> {t('addFriendModal.title')} </span>
        </>
      </Modal.Header>
      {foundResult ? (
        <div className={`${BLOCK_NAME}__user`}>
          <Avatar className={`${BLOCK_NAME}__user__avatar`} size={80} user={foundResult.user} />

          <h2
            className={`${BLOCK_NAME}__user__name`}>{`${foundResult.user.firstName} ${foundResult.user.lastName}`}</h2>
          <h4 className={`${BLOCK_NAME}__user__phone`}>
            {foundResult.user?.phoneNumber &&
              parsePhoneNumber(foundResult.user?.phoneNumber).formatInternational()}
          </h4>

          {success && (
            <div className={`${BLOCK_NAME}__success`}>
              <span>{t('addFriendModal.success')}</span>
            </div>
          )}

          <div className={`${BLOCK_NAME}__btn-block`}>
            <Link
              className={classNames(`${BLOCK_NAME}__btn`, {
                [`${BLOCK_NAME}__btn--confirm`]: foundResult?.inContacts || isUserWasAdded,
                [`${BLOCK_NAME}__btn--cancel`]: !(foundResult?.inContacts || isUserWasAdded),
              })}
              to={replaceInUrl(INSTANT_MESSAGING_CHAT_PATH, [
                'id?',
                ChatId.from(foundResult.user.id).id,
              ])}>
              {t('addFriendModal.chat')}
            </Link>
            {!(foundResult?.inContacts || isUserWasAdded) && (
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
              <button type="button" onClick={closeError} className={`${BLOCK_NAME}__error__close`}>
                <CloseSvg />
              </button>
            </div>
          )}
          <div className={`${BLOCK_NAME}__btn-block`}>
            <button
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
              onClick={animatedClose}>
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
  );
};

const AddFriendModal: React.FC<IAddFriendModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialAddFriendModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

AddFriendModal.displayName = 'AddFriendModal';

export { AddFriendModal };
