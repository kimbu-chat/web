import React, { useCallback, useContext, useState } from 'react';
import AddCallSvg from 'icons/add-call.svg';
import { LocalizationContext } from 'app/app';
import './add-call.scss';
import { FadeAnimationWrapper } from 'app/components';
// import { AddCallModal } from './add-call-modal/add-call-modal';

const AddCall = () => {
  const { t } = useContext(LocalizationContext);

  const [AddCallsModalDisplayed, setAddCallsModalDisplayed] = useState(false);
  const changeSetAddCallsModalDisplayedState = useCallback(() => {
    setAddCallsModalDisplayed((oldState) => !oldState);
  }, [setAddCallsModalDisplayed]);

  return (
    <>
      <div className='add-call'>
        <div className='add-call__icon-wrapper'>
          <AddCallSvg viewBox='0 0 65 64' />
        </div>

        <h3 className='add-call__title'>{t('addCall.title')}</h3>
        <h5 className='add-call__subtitle'>{t('addCall.subTitle')}</h5>

        <button onClick={changeSetAddCallsModalDisplayedState} type='button' className='add-call__btn'>
          {t('addCall.add')}
        </button>
      </div>

      <FadeAnimationWrapper isDisplayed={AddCallsModalDisplayed}>
        {/* <AddCallModal onClose={changeSetAddCallsModalDisplayedState} /> */}
        <div>{AddCallsModalDisplayed}</div>
      </FadeAnimationWrapper>
    </>
  );
};

AddCall.displayName = 'AddCall';

export { AddCall };
