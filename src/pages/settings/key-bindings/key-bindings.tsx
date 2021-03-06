import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RadioBox } from '@components/radio-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { changeTypingStrategyAction } from '@store/settings/actions';
import { TypingStrategy } from '@store/settings/features/models';
import { getTypingStrategySelector } from '@store/settings/selectors';

import './key-bindings.scss';

const KeyBindings = () => {
  const { t } = useTranslation();

  const currentStrategy = useSelector(getTypingStrategySelector);

  const changeTypingStrategy = useActionWithDispatch(changeTypingStrategyAction);
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
};

export default KeyBindings;
