import React from 'react';

import { useTranslation } from 'react-i18next';

import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as AddCallSvg } from '@icons/add-call.svg';

import { AddCallModal } from './add-call-modal/add-call-modal';

import './add-call.scss';

const BLOCK_NAME = 'add-call';

const AddCall = () => {
  const { t } = useTranslation();

  const [addCallsModalDisplayed, displayAddCallsModal, hideAddCallsModal] = useToggledState(false);

  return (
    <>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__icon-wrapper`}>
          <AddCallSvg />
        </div>

        <h3 className={`${BLOCK_NAME}__title`}>{t('addCall.title')}</h3>
        <h5 className={`${BLOCK_NAME}__subtitle`}>{t('addCall.subTitle')}</h5>

        <button onClick={displayAddCallsModal} type="button" className={`${BLOCK_NAME}__btn`}>
          {t('addCall.add')}
        </button>
      </div>

      {addCallsModalDisplayed && <AddCallModal onClose={hideAddCallsModal} />}
    </>
  );
};

AddCall.displayName = 'AddCall';

export { AddCall };
