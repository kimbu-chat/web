import React from 'react';

import { useTranslation } from 'react-i18next';

import { CreateGroupChatModal } from '@components/create-group-chat-modal';
import { AddFriendModal } from '@components/friend-list/add-friend/add-friend-modal/add-friend-modal';
import { NewChatModal } from '@components/new-chat-modal';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as AddContactSvg } from '@icons/add-users.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as KimbuLogo } from '@icons/kimbu-logo.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import renderText from '@utils/render-text/render-text';

import './welcome.scss';

const BLOCK_NAME = 'welcome';

export const Welcome = () => {
  const { t } = useTranslation();

  const [createNewGroupChatDisplayed, displayCreateNewGroupChat, hideCreateNewGroupChat] =
    useToggledState(false);
  const [addFriendsModalDisplayed, displayAddFriendsModal, hideAddFriendsModal] =
    useToggledState(false);
  const [createChatModalDisplayed, displayCreateChatModal, hideCreateChatModal] =
    useToggledState(false);

  return (
    <>
      <div className={BLOCK_NAME}>
        <KimbuLogo />
        <h2 className={`${BLOCK_NAME}__title`}>{t('welcome.welcome')}</h2>
        <h3 className={`${BLOCK_NAME}__sub-title`}>{t('welcome.select-next-step')}</h3>
        <div className={`${BLOCK_NAME}__options`}>
          <button
            onClick={displayAddFriendsModal}
            type="button"
            className={`${BLOCK_NAME}__option`}>
            <div className={`${BLOCK_NAME}__option-logo`}>
              <AddContactSvg className={`${BLOCK_NAME}__option-logo__icon`} />
            </div>
            <h5 className={`${BLOCK_NAME}__option-title`}>
              {renderText(t('welcome.add-new-contact'), ['br_jsx'])}
            </h5>
          </button>
          <button
            onClick={displayCreateChatModal}
            type="button"
            className={`${BLOCK_NAME}__option`}>
            <div className={`${BLOCK_NAME}__option-logo`}>
              <SendSvg className={`${BLOCK_NAME}__option-logo__icon`} />
            </div>
            <h5 className={`${BLOCK_NAME}__option-title`}>
              {renderText(t('welcome.create-new-message'), ['br_jsx'])}
            </h5>
          </button>
          <button
            onClick={displayCreateNewGroupChat}
            type="button"
            className={`${BLOCK_NAME}__option`}>
            <div className={`${BLOCK_NAME}__option-logo`}>
              <GroupSvg className={`${BLOCK_NAME}__option-logo__icon`} />
            </div>
            <h5 className={`${BLOCK_NAME}__option-title`}>
              {renderText(t('welcome.create-new-chat'), ['br_jsx'])}
            </h5>
          </button>
        </div>
      </div>

      {createNewGroupChatDisplayed && <CreateGroupChatModal onClose={hideCreateNewGroupChat} />}
      {addFriendsModalDisplayed && <AddFriendModal onClose={hideAddFriendsModal} />}
      {createChatModalDisplayed && <NewChatModal onClose={hideCreateChatModal} />}
    </>
  );
};
