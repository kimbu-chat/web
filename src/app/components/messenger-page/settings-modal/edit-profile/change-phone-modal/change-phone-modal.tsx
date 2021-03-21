import React, { useContext, useState } from 'react';
import ChatSvg from '@icons/single-chat.svg';
import './change-phone-modal.scss';
import { LocalizationContext } from '@contexts';
import { WithBackground, Modal, PhoneInputGroup } from '@components';
import CrayonSvg from '@icons/crayon.svg';
import parsePhoneNumberFromString from 'libphonenumber-js';
import useInterval from 'use-interval';
import moment from 'moment';

interface IChangePhoneModalProps {
  onClose: () => void;
}

export const ChangePhoneModal: React.FC<IChangePhoneModalProps> = ({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [submited, setSubmited] = useState(false);
  const [remainedTime, setRemainedTime] = useState(60);

  useInterval(() => {
    if (submited && remainedTime > 0) {
      setRemainedTime((old) => old - 1);
    }
  }, 1000);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          submited ? (
            <>
              <ChatSvg className='change-phone-modal__icon' viewBox='0 0 24 24' />
              <span> {t('changePhoneModal.code-sent')} </span>
            </>
          ) : (
            <>
              <CrayonSvg className='change-phone-modal__icon' viewBox='0 0 16 16' />
              <span> {t('changePhoneModal.change-number')} </span>
            </>
          )
        }
        content={
          <div className='change-phone-modal'>
            <PhoneInputGroup
              submitFunction={() => {
                setSubmited(true);
              }}
              hideCountrySelect={submited}
              phone={phone}
              setPhone={setPhone}
            />

            {submited && (
              <>
                <div className='change-phone-modal__input-block'>
                  <span className='change-phone-modal__input-label'>{t('changePhoneModal.code')}</span>
                  <input value={code} onChange={(e) => setCode(e.target.value)} type='text' className='change-phone-modal__input' />
                </div>
                <span className='change-phone-modal__details'>{t('changePhoneModal.details', { time: moment.utc(remainedTime * 1000).format('mm:ss') })}</span>
              </>
            )}
          </div>
        }
        closeModal={onClose}
        buttons={[
          submited && (
            <button type='button' className='change-phone-modal__btn change-phone-modal__btn--cancel' onClick={onClose}>
              {t('changePhoneModal.cancel')}
            </button>
          ),
          submited ? (
            <button
              disabled={code.length !== 4}
              type='button'
              className='change-phone-modal__btn change-phone-modal__btn--submit'
              onClick={() => {
                setSubmited(true);
              }}
            >
              {t('changePhoneModal.confirm')}
            </button>
          ) : (
            <button
              disabled={!parsePhoneNumberFromString(phone)?.isValid()}
              type='button'
              className='change-phone-modal__btn change-phone-modal__btn--submit'
              onClick={() => {
                setSubmited(true);
              }}
            >
              {t('changePhoneModal.change')}
            </button>
          ),
        ]}
      />
    </WithBackground>
  );
};
