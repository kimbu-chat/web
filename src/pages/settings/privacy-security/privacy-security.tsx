import React from 'react';

import { useTranslation } from 'react-i18next';

import { HorizontalSeparator } from '@components/horizontal-separator';
import { RadioBox } from '@components/radio-box';

import { BlockedUsers } from './blocked-users/blocked-users';
import { SessionsList } from './sessions-list/sessions-list';

import './privacy-security.scss';

const BLOCK_NAME = 'privacy-security';

const PrivacySecurity = () => {
  const { t } = useTranslation();

  return (
    <div className={BLOCK_NAME}>
      <h3 className={`${BLOCK_NAME}__title`}>{t('privacySecurity.title')}</h3>

      <h2 className={`${BLOCK_NAME}__subject`}>{t('privacySecurity.who-can-message-me')}</h2>
      <div className={`${BLOCK_NAME}__radiobox-group`}>
        <RadioBox
          groupName="who-can-message-me"
          defaultChecked
          content={t('privacySecurity.contacts')}
        />
        <RadioBox groupName="who-can-message-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-message-me" content={t('privacySecurity.everyone')} />
      </div>
      <HorizontalSeparator />

      <h2 className={`${BLOCK_NAME}__subject`}>{t('privacySecurity.who-can-call-me')}</h2>
      <div className={`${BLOCK_NAME}__radiobox-group`}>
        <RadioBox
          groupName="who-can-call-me"
          defaultChecked
          content={t('privacySecurity.contacts')}
        />
        <RadioBox groupName="who-can-call-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-call-me" content={t('privacySecurity.everyone')} />
      </div>
      <HorizontalSeparator />

      <h2 className={`${BLOCK_NAME}__subject`}>{t('privacySecurity.who-can-find-me')}</h2>
      <div className={`${BLOCK_NAME}__radiobox-group`}>
        <RadioBox groupName="who-can-find-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-find-me" content={t('privacySecurity.everyone')} />
      </div>
      <HorizontalSeparator />

      <BlockedUsers />
      <HorizontalSeparator />
      <SessionsList />
    </div>
  );
};

export default PrivacySecurity;
