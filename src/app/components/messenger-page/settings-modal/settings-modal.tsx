import { LocalizationContext } from 'app/app';
import { BaseBtn } from 'app/components';
import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import NotificationSvg from 'icons/ic-notifications-on.svg';
import InfoSvg from 'icons/ic-info.svg';
import TextSvg from 'icons/ic-text-typing.svg';
import { EditProfile } from './edit-profile/edit-profile';
import { LanguageSettings } from './language-settings/language-settings';
import { NotificationsSettings } from './notifications-settings/notifications-settings';
import { TextTyping } from './text-typing/text-typing';
import './settings-modal.scss';

enum SettingsModalPages {
  Profile = 'profile',
  Notifications = 'notifications',
  Typing = 'typing',
  Language = 'language',
}

export const SettingsModal = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const [currentPage, setCurrentPage] = useState<SettingsModalPages>();

  return ReactDOM.createPortal(
    <div className='settings-modal'>
      <div className='settings-modal__left'>
        <div className='settings-modal__links'>
          <BaseBtn
            color='primary'
            width='contained'
            variant='contained'
            icon={<InfoSvg />}
            onClick={() => setCurrentPage(SettingsModalPages.Profile)}
            className='settings-modal__link'
          >
            {t('settings.edit_profile')}
          </BaseBtn>
          <BaseBtn
            icon={<NotificationSvg />}
            color='primary'
            width='contained'
            variant='contained'
            onClick={() => setCurrentPage(SettingsModalPages.Notifications)}
            className='settings-modal__link'
          >
            {t('settings.notifications')}
          </BaseBtn>
          <BaseBtn
            color='primary'
            width='contained'
            variant='contained'
            icon={<TextSvg />}
            onClick={() => setCurrentPage(SettingsModalPages.Typing)}
            className='settings-modal__link'
          >
            {t('settings.text_typing')}
          </BaseBtn>
          <BaseBtn
            color='primary'
            width='contained'
            variant='contained'
            icon={<TextSvg />}
            onClick={() => setCurrentPage(SettingsModalPages.Language)}
            className='settings-modal__link'
          >
            {t('settings.language')}
          </BaseBtn>
        </div>
      </div>

      <div className='settings__right'>
        {currentPage === SettingsModalPages.Profile && <EditProfile />}

        {currentPage === SettingsModalPages.Notifications && <NotificationsSettings />}

        {currentPage === SettingsModalPages.Language && <LanguageSettings />}

        {currentPage === SettingsModalPages.Typing && <TextTyping />}
      </div>
    </div>,
    document.getElementById('root') || document.createElement('div'),
  );
});
