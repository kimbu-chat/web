import { LocalizationContext } from '@app/contexts';
import { IMessage, MessageState, SystemMessageType } from '@app/store/chats/models';
import React, { useContext, useState } from 'react';
import { UserStatus } from '@app/store/common/models';
import firstAvatar from '@icons/mockedUser1.png';
import { myProfileSelector } from '@app/store/my-profile/selectors';
import { useSelector } from 'react-redux';
import './appearance.scss';
import { RadioBox } from '../shared/radio-box/radio-box';
import { MessageItem } from '../../message-item/message-item';

export const Appearance: React.FC = () => {
  const { t } = useContext(LocalizationContext);

  const [fontSize, setFontSize] = useState(16);

  const currentUser = useSelector(myProfileSelector);

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
        status: UserStatus.Online,
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
      userCreator: currentUser!,
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
        status: UserStatus.Online,
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
      userCreator: currentUser!,
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
        status: UserStatus.Online,
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

  return (
    <div className='appearance'>
      <h3 className='appearance__title'>{t('appearance.title')}</h3>
      <h3 className='appearance__theme'>{t('appearance.choose-theme')}</h3>
      <div className='appearance__theme-box'>
        {messages.map((msg: IMessage) => (
          <div className='appearance__theme-box__msg-wrapper'>
            <MessageItem message={msg} key={msg.id} />
          </div>
        ))}
      </div>
      <div className='appearance__theme-select'>
        <RadioBox groupName='theme' defaultChecked content={t('appearance.dark')} />
      </div>
      <div className='appearance__theme-select'>
        <RadioBox groupName='theme' defaultChecked={false} content={t('appearance.light')} />
      </div>
      <h3 className='appearance__font-size-title'>{t('appearance.font-size')}</h3>
      <div className='appearance__font-size-box'>
        <div className='appearance__font-sizes'>
          <button
            onClick={() => setFontSize(12)}
            type='button'
            className={`appearance__font-size appearance__font-size--12 ${fontSize === 12 ? 'appearance__font-size--active' : ''}`}
          >
            <span>12 pt</span>
            <div className={`appearance__font-progress-circle  ${fontSize === 12 ? '' : 'appearance__font-progress-circle--transparent'}`} />
          </button>
          <button
            onClick={() => setFontSize(14)}
            type='button'
            className={`appearance__font-size appearance__font-size--14 ${fontSize === 14 ? 'appearance__font-size--active' : ''}`}
          >
            <span>14 pt</span>
            <div className={`appearance__font-progress-circle  ${fontSize === 14 ? '' : 'appearance__font-progress-circle--transparent'}`} />
          </button>
          <button
            onClick={() => setFontSize(16)}
            type='button'
            className={`appearance__font-size appearance__font-size--16 ${fontSize === 16 ? 'appearance__font-size--active' : ''}`}
          >
            <span>16 pt</span>
            <div className={`appearance__font-progress-circle  ${fontSize === 16 ? '' : 'appearance__font-progress-circle--transparent'}`} />
          </button>
          <button
            onClick={() => setFontSize(18)}
            type='button'
            className={`appearance__font-size appearance__font-size--18 ${fontSize === 18 ? 'appearance__font-size--active' : ''}`}
          >
            <span>18 pt</span>
            <div className={`appearance__font-progress-circle  ${fontSize === 18 ? '' : 'appearance__font-progress-circle--transparent'}`} />
          </button>
          <button
            onClick={() => setFontSize(24)}
            type='button'
            className={`appearance__font-size appearance__font-size--24 ${fontSize === 24 ? 'appearance__font-size--active' : ''}`}
          >
            <span>24 pt</span>
            <div className={`appearance__font-progress-circle  ${fontSize === 24 ? '' : 'appearance__font-progress-circle--transparent'}`} />
          </button>
        </div>
        <div className='appearance__font-progress' />
      </div>
    </div>
  );
};
