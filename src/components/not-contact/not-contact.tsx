import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as ContactSvg } from '@icons/user-o.svg';
import { Button } from '@shared-components/button';
import { getSelectedInterlocutorSelector } from '@store/chats/selectors';
import { addFriendAction, dismissToAddContactAction } from '@store/friends/actions';
import { blockUserAction } from '@store/settings/actions';

import './not-contact.scss';

const BLOCK_NAME = 'not-contact';

export const NotContact = () => {
  const { t } = useTranslation();

  const interlocutor = useSelector(getSelectedInterlocutorSelector);

  const addFriend = useActionWithDeferred(addFriendAction);
  const blockUser = useActionWithDeferred(blockUserAction);
  const dismissUser = useActionWithDeferred(dismissToAddContactAction);

  const [addLoading, setAddLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  const addSelectedUserToContacts = useCallback(() => {
    setAddLoading(true);
    if (interlocutor?.id) {
      dismissUser(interlocutor?.id);
      addFriend(interlocutor).then(() => {
        setAddLoading(false);
      });
    }
  }, [addFriend, interlocutor, dismissUser]);

  const addSelectedUserToBlackList = useCallback(() => {
    setBlockLoading(true);
    if (interlocutor?.id) {
      dismissUser(interlocutor.id);
      blockUser(interlocutor.id).then(() => {
        setBlockLoading(false);
      });
    }
  }, [blockUser, interlocutor?.id, dismissUser]);

  const dismissSelectedUserToBlackList = useCallback(() => {
    if (interlocutor?.id) {
      dismissUser(interlocutor.id);
    }
  }, [dismissUser, interlocutor?.id]);

  return (
    <div className={BLOCK_NAME}>
      <ContactSvg className={`${BLOCK_NAME}__contact-icon`} />

      <div className={`${BLOCK_NAME}__description`}>
        {t('notContact.description', {
          fullName: `${interlocutor?.firstName} ${interlocutor?.lastName}`,
        })}
      </div>

      <div className={`${BLOCK_NAME}__btn-group`}>
        <Button
          onClick={addSelectedUserToContacts}
          loading={addLoading}
          type="button"
          className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--add`)}>
          {t('notContact.add')}
        </Button>
        <Button
          onClick={addSelectedUserToBlackList}
          loading={blockLoading}
          type="button"
          className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--block`)}>
          {t('notContact.block')}
        </Button>
        <button
          onClick={dismissSelectedUserToBlackList}
          type="button"
          className={`${BLOCK_NAME}__close-btn`}>
          <CloseSvg />
        </button>
      </div>
    </div>
  );
};
