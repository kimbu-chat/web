import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import './appearance.scss';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { Theme } from '@store/settings/features/models';
import { getCurrentFontSizeSelector, getCurrentThemeSelector } from '@store/settings/selectors';
import { changeThemeAction, changeFontSizeAction } from '@store/settings/actions';
import { MessageItem } from '../../message-item/message-item';
import { RadioBox } from '../shared/radio-box/radio-box';

export const Appearance: React.FC = () => {
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

  return (
    <div className="appearance">
      <h3 className="appearance__title">{t('appearance.title')}</h3>
      <h3 className="appearance__theme">{t('appearance.choose-theme')}</h3>
      <div className="appearance__theme-box">
        {[1, 2, 3, 4, 5].map((messageId) => (
          <div key={messageId} className="appearance__theme-box__msg-wrapper">
            <MessageItem selectedChatId={5} messageId={messageId} />
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
