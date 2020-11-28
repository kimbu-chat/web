import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'store/settings/actions';
import { TypingStrategy } from 'store/settings/models';
import { getTypingStrategy } from 'store/settings/selectors';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RadioBox } from '../shared/radio-box/radio-box';
import './text-typing.scss';

export const TextTyping = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const currentStrategy = useSelector(getTypingStrategy);

  const changeTypingStrategy = useActionWithDispatch(SettingsActions.changeTypingStrategyAction);
  const setNle = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.nle });
  }, []);

  const setNlce = useCallback(() => {
    changeTypingStrategy({ strategy: TypingStrategy.nlce });
  }, []);

  return (
    <div className='text-typing'>
      <form>
        <RadioBox
          groupName='text-typing'
          nestingLevel={0}
          onClick={setNlce}
          defaultChecked={currentStrategy === TypingStrategy.nlce}
          title={t('textTyping.nlce')}
        />
        <RadioBox
          groupName='text-typing'
          nestingLevel={0}
          onClick={setNle}
          defaultChecked={currentStrategy === TypingStrategy.nle}
          title={t('textTyping.nle')}
        />
      </form>
    </div>
  );
});
