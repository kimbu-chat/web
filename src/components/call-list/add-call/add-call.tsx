import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';

import { AddCallModal } from './add-call-modal/add-call-modal';

import './add-call.scss';

const AddCall = () => {
  const { t } = useTranslation();

  const [addCallsModalDisplayed, setAddCallsModalDisplayed] = useState(false);
  const changeSetAddCallsModalDisplayedState = useCallback(() => {
    setAddCallsModalDisplayed((oldState) => !oldState);
  }, [setAddCallsModalDisplayed]);

  return (
    <>
      <div className="add-call">
        <div className="add-call__icon-wrapper">
          <AddCallSvg viewBox="0 0 65 64" />
        </div>

        <h3 className="add-call__title">{t('addCall.title')}</h3>
        <h5 className="add-call__subtitle">{t('addCall.subTitle')}</h5>

        <button
          onClick={changeSetAddCallsModalDisplayedState}
          type="button"
          className="add-call__btn">
          {t('addCall.add')}
        </button>
      </div>

      <FadeAnimationWrapper isDisplayed={addCallsModalDisplayed}>
        <AddCallModal onClose={changeSetAddCallsModalDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
};

AddCall.displayName = 'AddCall';

export { AddCall };
