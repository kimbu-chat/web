import { useTranslation } from 'react-i18next';
import { IMessage, MessageState, SystemMessageType } from '@store/chats/models';
import React, { useCallback } from 'react';
import { IUser } from '@store/common/models';
import firstAvatar from '@icons/mockedUser1.png';
import { myProfileSelector } from '@store/my-profile/selectors';
import { useSelector } from 'react-redux';
import './appearance.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ChangeTheme } from '@store/settings/features/change-theme/change-theme';
import { Theme } from '@store/settings/features/models';
import { getCurrentFontSizeSelector, getCurrentThemeSelector } from '@store/settings/selectors';
import { ChangeFontSize } from '@store/settings/features/change-font-size/change-font-size';
import { MessageItem } from '../../message-item/message-item';
import { RadioBox } from '../shared/radio-box/radio-box';

export const Appearance: React.FC = () => {
  const { t } = useTranslation();

  const changeTheme = useActionWithDispatch(ChangeTheme.action);
  const changeFontSize = useActionWithDispatch(ChangeFontSize.action);

  const currentUser = useSelector(myProfileSelector);
  const currentTheme = useSelector(getCurrentThemeSelector);
  const fontSize = useSelector(getCurrentFontSizeSelector);

  const messages: IMessage[] = [
    {
      id: 1,
      userCreator: {
        id: -1,
        firstName: 'Julie',
        lastName: 'Key',
        avatar: {
          url: firstAvatar,
          previewUrl: firstAvatar,
          id: -5,
        },
        nickname: '',
        online: true,
        lastOnlineTime: new Date(0),
        phoneNumber: '',
      },
      creationDateTime: new Date(1000),
      text: 'See later',
      systemMessageType: SystemMessageType.None,
      state: MessageState.READ,
      chatId: -1,
      needToShowCreator: true,
    },
    {
      id: 4,
      userCreator: currentUser as IUser,
      creationDateTime: new Date(10000),
      text: 'Italian or Corean kitchen?',
      systemMessageType: SystemMessageType.None,
      state: MessageState.READ,
      chatId: -1,
      needToShowCreator: true,
    },
    {
      id: 2,
      userCreator: {
        id: -1,
        firstName: 'Julie',
        lastName: 'Key',
        avatar: {
          url: firstAvatar,
          previewUrl: firstAvatar,
          id: -5,
        },
        nickname: '',
        online: true,
        lastOnlineTime: new Date(0),
        phoneNumber: '',
      },
      creationDateTime: new Date(1000000),
      text: 'See later',
      systemMessageType: SystemMessageType.None,
      state: MessageState.READ,
      chatId: -1,
      needToShowCreator: true,
    },
    {
      id: 5,
      userCreator: currentUser as IUser,
      creationDateTime: new Date(10000000),
      text: 'Italian or Corean kitchen?',
      systemMessageType: SystemMessageType.None,
      state: MessageState.READ,
      chatId: -1,
      needToShowCreator: true,
    },
    {
      id: 3,
      userCreator: {
        id: -1,
        firstName: 'Julie',
        lastName: 'Key',
        avatar: {
          url: firstAvatar,
          previewUrl: firstAvatar,
          id: -5,
        },
        nickname: '',
        online: true,
        lastOnlineTime: new Date(0),
        phoneNumber: '',
      },
      creationDateTime: new Date(0),
      text: 'Where shall we go?',
      systemMessageType: SystemMessageType.None,
      state: MessageState.READ,
      chatId: -1,
      needToShowCreator: true,
    },
  ];

  const goToLightTheme = useCallback(() => {
    changeTheme(Theme.LIGHT);
  }, [changeTheme]);
  const goToDarkTheme = useCallback(() => {
    changeTheme(Theme.DARK);
  }, [changeTheme]);

  return (
    <div className="appearance">
      <h3 className="appearance__title">{t('appearance.title')}</h3>
      <h3 className="appearance__theme">{t('appearance.choose-theme')}</h3>
      <div className="appearance__theme-box">
        {messages.map((msg: IMessage) => (
          <div key={msg.id} className="appearance__theme-box__msg-wrapper">
            <MessageItem message={msg} />
          </div>
        ))}
      </div>
      <div className="appearance__theme-select">
        <RadioBox
          groupName="theme"
          onClick={goToDarkTheme}
          defaultChecked={currentTheme === Theme.DARK}
          content={t('appearance.dark')}
        />
      </div>
      <div className="appearance__theme-select">
        <RadioBox
          groupName="theme"
          onClick={goToLightTheme}
          defaultChecked={currentTheme === Theme.LIGHT}
          content={t('appearance.light')}
        />
      </div>
      <h3 className="appearance__font-size-title">{t('appearance.font-size')}</h3>
      <div className="appearance__font-size-box">
        <div className="appearance__font-sizes">
          <button
            onClick={() => changeFontSize(12)}
            type="button"
            className={`appearance__font-size appearance__font-size--12 ${
              fontSize === 12 ? 'appearance__font-size--active' : ''
            }`}>
            <span>12 pt</span>
            <div
              className={`appearance__font-progress-circle  ${
                fontSize === 12 ? '' : 'appearance__font-progress-circle--transparent'
              }`}
            />
          </button>
          <button
            onClick={() => changeFontSize(14)}
            type="button"
            className={`appearance__font-size appearance__font-size--14 ${
              fontSize === 14 ? 'appearance__font-size--active' : ''
            }`}>
            <span>14 pt</span>
            <div
              className={`appearance__font-progress-circle  ${
                fontSize === 14 ? '' : 'appearance__font-progress-circle--transparent'
              }`}
            />
          </button>
          <button
            onClick={() => changeFontSize(16)}
            type="button"
            className={`appearance__font-size appearance__font-size--16 ${
              fontSize === 16 ? 'appearance__font-size--active' : ''
            }`}>
            <span>16 pt</span>
            <div
              className={`appearance__font-progress-circle  ${
                fontSize === 16 ? '' : 'appearance__font-progress-circle--transparent'
              }`}
            />
          </button>
          <button
            onClick={() => changeFontSize(18)}
            type="button"
            className={`appearance__font-size appearance__font-size--18 ${
              fontSize === 18 ? 'appearance__font-size--active' : ''
            }`}>
            <span>18 pt</span>
            <div
              className={`appearance__font-progress-circle  ${
                fontSize === 18 ? '' : 'appearance__font-progress-circle--transparent'
              }`}
            />
          </button>
          <button
            onClick={() => changeFontSize(24)}
            type="button"
            className={`appearance__font-size appearance__font-size--24 ${
              fontSize === 24 ? 'appearance__font-size--active' : ''
            }`}>
            <span>24 pt</span>
            <div
              className={`appearance__font-progress-circle  ${
                fontSize === 24 ? '' : 'appearance__font-progress-circle--transparent'
              }`}
            />
          </button>
        </div>
        <div className="appearance__font-progress" />
      </div>
    </div>
  );
};
