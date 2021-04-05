import { useTranslation } from 'react-i18next';
import React from 'react';
import { RadioBox } from '../shared/radio-box/radio-box';
import { BlockedUsers } from './blocked-users/blocked-users';
import './privacy-security.scss';
import { SessionsList } from './sessions-list/sessions-list';

export const PrivacySecurity = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-security">
      <h3 className="privacy-security__title">{t('privacySecurity.title')}</h3>

      <h2 className="privacy-security__subject">{t('privacySecurity.who-can-message-me')}</h2>
      <div className="privacy-security__radiobox-group">
        <RadioBox
          groupName="who-can-message-me"
          defaultChecked
          content={t('privacySecurity.contacts')}
        />
        <RadioBox groupName="who-can-message-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-message-me" content={t('privacySecurity.everyone')} />
      </div>

      <h2 className="privacy-security__subject">{t('privacySecurity.who-can-call-me')}</h2>
      <div className="privacy-security__radiobox-group">
        <RadioBox
          groupName="who-can-call-me"
          defaultChecked
          content={t('privacySecurity.contacts')}
        />
        <RadioBox groupName="who-can-call-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-call-me" content={t('privacySecurity.everyone')} />
      </div>

      <h2 className="privacy-security__subject">{t('privacySecurity.who-can-find-me')}</h2>
      <div className="privacy-security__radiobox-group">
        <RadioBox groupName="who-can-find-me" content={t('privacySecurity.no-one')} />
        <RadioBox groupName="who-can-find-me" content={t('privacySecurity.everyone')} />
      </div>

      <BlockedUsers />

      <SessionsList />
    </div>
  );
};
