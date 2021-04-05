import { useTranslation } from 'react-i18next';
import * as SettingsActions from '@store/settings/actions';

import { getTypingStrategySelector } from '@store/settings/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TypingStrategy } from '@store/settings/features/models';
import { RadioBox } from '../shared/radio-box/radio-box';
import './key-bindings.scss';

export const KeyBindings = React.memo(() => {
  const { t } = useTranslation();

  const currentStrategy = useSelector(getTypingStrategySelector);

  const changeTypingStrategy = useActionWithDispatch(SettingsActions.changeTypingStrategyAction);
  const setNle = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.Nle });
  }, [changeTypingStrategy]);

  const setNlce = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.Nlce });
  }, [changeTypingStrategy]);

  return (
    <div className="key-bindings">
      <h3 className="key-bindings__title">{t('keyBindings.title')}</h3>
      <form>
        <div className="key-bindings__entity">
          <RadioBox
            groupName="key-bindings"
            onClick={setNlce}
            defaultChecked={currentStrategy === TypingStrategy.Nlce}
            content={t('keyBindings.nlce')}
          />
        </div>
        <div className="key-bindings__entity">
          <RadioBox
            groupName="key-bindings"
            onClick={setNle}
            defaultChecked={currentStrategy === TypingStrategy.Nle}
            content={t('keyBindings.nle')}
          />
        </div>
      </form>
    </div>
  );
});
