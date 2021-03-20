import { LocalizationContext } from '@contexts';
import * as SettingsActions from '@store/settings/actions';

import { getTypingStrategySelector } from '@store/settings/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { TypingStrategy } from '@store/settings/features/models';
import { RadioBox } from '../shared/radio-box/radio-box';
import './text-typing.scss';

export const TextTyping = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const currentStrategy = useSelector(getTypingStrategySelector);

  const changeTypingStrategy = useActionWithDispatch(SettingsActions.changeTypingStrategyAction);
  const setNle = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.Nle });
  }, []);

  const setNlce = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.Nlce });
  }, []);

  return (
    <div className='text-typing'>
      <form>
        <RadioBox
          groupName='text-typing'
          nestingLevel={0}
          onClick={setNlce}
          defaultChecked={currentStrategy === TypingStrategy.Nlce}
          title={t('textTyping.nlce')}
        />
        <RadioBox
          groupName='text-typing'
          nestingLevel={0}
          onClick={setNle}
          defaultChecked={currentStrategy === TypingStrategy.Nle}
          title={t('textTyping.nle')}
        />
      </form>
    </div>
  );
});
