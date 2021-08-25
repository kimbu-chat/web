import React, { useCallback } from 'react';

import Slider from 'rc-slider/lib/Slider';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { HorizontalSeparator } from '@components/horizontal-separator';
import { MessageItem } from '@components/message-item';
import { RadioBox } from '@components/radio-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { changeThemeAction, changeFontSizeAction } from '@store/settings/actions';
import { Theme } from '@store/settings/features/models';
import { getCurrentFontSizeSelector, getCurrentThemeSelector } from '@store/settings/selectors';
import { APPEARANCE_CHAT_ID } from '@utils/constants';

import './appearance.scss';

const Appearance: React.FC = () => {
  const { t } = useTranslation();

  const changeTheme = useActionWithDispatch(changeThemeAction);
  const changeFontSize = useActionWithDispatch(changeFontSizeAction);

  const currentTheme = useSelector(getCurrentThemeSelector);
  const fontSize = useSelector(getCurrentFontSizeSelector);

  const goToLightTheme = useCallback(() => {
    changeTheme(Theme.LIGHT);
  }, [changeTheme]);
  const goToDarkTheme = useCallback(() => {
    changeTheme(Theme.DARK);
  }, [changeTheme]);

  const getFontLabel = (size: number) => (
    <span
      className={`appearance__font-size appearance__font-size--${size} ${
        size === fontSize ? 'appearance__font-size--active' : ''
      }`}>{`${size} pt`}</span>
  );

  const handleStyle: React.CSSProperties = {
    background: '#3f8ae0',
    border: '4px solid #fff',
    borderRadius: '50%',
    bottom: '-4px',
    boxSizing: 'border-box',
    height: '28px',
    left: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
    width: '28px',
    cursor: 'pointer',
  };

  const railStyle: React.CSSProperties = {
    background: '#3f8ae0',
    borderRadius: '6px',
    boxShadow:
      'inset -2px 2px 4px rgba(46, 101, 164, 0.2), inset 2px -2px 4px rgba(46, 101, 164, 0.2), inset -2px -2px 4px rgba(80, 175, 255, 0.9), inset 2px 2px 5px rgba(46, 101, 164, 0.9)',
    height: '20px',
    marginTop: '14px',
    cursor: 'pointer',
  };

  return (
    <div className="appearance">
      <h3 className="appearance__title">{t('appearance.title')}</h3>
      <h3 className="appearance__theme">{t('appearance.choose-theme')}</h3>
      <div className="appearance__theme-box">
        {['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9'].map((messageId) => (
          <div key={messageId} className="appearance__theme-box__msg-wrapper">
            <MessageItem
              // eslint-disable-next-line
              observeIntersection={() => () => {}}
              needToShowCreator={messageId === '-1'}
              selectedChatId={APPEARANCE_CHAT_ID}
              messageId={messageId}
            />
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
      <HorizontalSeparator />
      <h3 className="appearance__font-size-title">{t('appearance.font-size')}</h3>

      <div className="appearance__font-sizes">
        <Slider
          handleStyle={handleStyle}
          railStyle={railStyle}
          value={fontSize}
          min={11}
          max={25}
          step={2}
          marks={{
            12: getFontLabel(12),
            14: getFontLabel(14),
            16: getFontLabel(16),
            18: getFontLabel(18),
            24: getFontLabel(24),
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={changeFontSize}
        />
      </div>
    </div>
  );
};

export default Appearance;
