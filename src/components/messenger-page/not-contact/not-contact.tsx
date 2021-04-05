import React, { useCallback } from 'react';
import './not-contact.scss';

import { ReactComponent as ContactSvg } from '@icons/user-o.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { BlockUser } from '@store/settings/features/block-user/block-user';
import { getSelectedInterlocutorSelector } from '@store/chats/selectors';
import { AddFriend } from '@store/friends/features/add-friend/add-friend';
import { useSelector } from 'react-redux';
import { DismissToAddContact } from '@store/friends/features/dismiss-to-add-contact/dismiss-to-add-contact';
import classNames from 'classnames';

export const NotContact = () => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  const BLOCK_NAME = 'not-contact';

  const interlocutor = useSelector(getSelectedInterlocutorSelector);

  const addFriend = useActionWithDeferred(AddFriend.action);
  const blockUser = useActionWithDeferred(BlockUser.action);
  const dismissUser = useActionWithDeferred(DismissToAddContact.action);

  const addSelectedUserToContacts = useCallback(() => {
    if (interlocutor?.id) {
      dismissUser(interlocutor.id);
      addFriend(interlocutor);
    }
  }, [addFriend, interlocutor, dismissUser]);

  const addSelectedUserToBlackList = useCallback(() => {
    if (interlocutor?.id) {
      dismissUser(interlocutor.id);
      blockUser(interlocutor);
    }
  }, [blockUser, interlocutor, dismissUser]);

  const dismissSelectedUserToBlackList = useCallback(() => {
    if (interlocutor?.id) {
      dismissUser(interlocutor.id);
    }
  }, [dismissUser, interlocutor?.id]);

  return (
    <div className={classNames(BLOCK_NAME)}>
      <ContactSvg className={classNames(`${BLOCK_NAME}__contact-icon`)} viewBox="0 0 24 24" />

      <div className={classNames(`${BLOCK_NAME}__description`)}>
        {t('notContact.description', {
          fullName: `${interlocutor?.firstName} ${interlocutor?.lastName}`,
        })}
      </div>

      <div className={classNames(`${BLOCK_NAME}__btn-group`)}>
        <button
          onClick={addSelectedUserToContacts}
          type="button"
          className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--add`)}>
          {t('notContact.add')}
        </button>
        <button
          onClick={addSelectedUserToBlackList}
          type="button"
          className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--block`)}>
          {t('notContact.block')}
        </button>
        <button
          onClick={dismissSelectedUserToBlackList}
          type="button"
          className={classNames(`${BLOCK_NAME}__close-btn`)}>
          <CloseSvg viewBox="0 0 24 24" />
        </button>
      </div>
    </div>
  );
};
