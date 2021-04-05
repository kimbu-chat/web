import React, { useCallback, useState } from 'react';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import './add-call.scss';
import { FadeAnimationWrapper } from '@components/shared';
import { AddCallModal } from './add-call-modal/add-call-modal';

const AddCall = () => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

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
