import React, { useCallback, useContext, useState } from 'react';
import ChatSvg from '@icons/single-chat.svg';
import './change-phone-modal.scss';
import { LocalizationContext } from '@contexts';
import { WithBackground, Modal, PhoneInputGroup, LabeledInput } from '@components';
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

  const nextStep = useCallback(() => {
    setSubmited(true);
    setRemainedTime(60);
  }, [setSubmited, setRemainedTime]);

  const prevStep = useCallback(() => {
    setSubmited(false);
  }, [setSubmited]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          submited ? (
            <>
              <ChatSvg className="change-phone-modal__icon" viewBox="0 0 24 24" />
              <span> {t('changePhoneModal.code-sent')} </span>
            </>
          ) : (
            <>
              <CrayonSvg className="change-phone-modal__icon" viewBox="0 0 16 16" />
              <span> {t('changePhoneModal.change-number')} </span>
            </>
          )
        }
        content={(
          <div className="change-phone-modal">
            <PhoneInputGroup
              submitFunction={() => {
                setSubmited(true);
              }}
              hideCountrySelect={submited}
              phone={phone}
              setPhone={setPhone}
              phoneInputIcon={
                submited && (
                  <button type="button" className="change-phone-modal__back-icon">
                    <CrayonSvg onClick={prevStep} viewBox="0 0 16 16" />
                  </button>
                )
              }
            />

            {submited && (
              <>
                <LabeledInput
                  label={t('changePhoneModal.code')}
                  placeholder={t('changePhoneModal.enter-numbers')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  containerClassName="change-phone-modal__input"
                />

                <span className="change-phone-modal__details">
                  {t('changePhoneModal.details', { time: moment.utc(remainedTime * 1000).format('mm:ss') })}
                </span>
              </>
            )}
          </div>
        )}
        closeModal={onClose}
        buttons={[
          !submited && (
            <button key={1} type="button" className="change-phone-modal__btn change-phone-modal__btn--cancel" onClick={onClose}>
              {t('changePhoneModal.cancel')}
            </button>
          ),
          submited ? (
            <button
              key={2}
              disabled={code.length !== 4}
              type="button"
              className="change-phone-modal__btn change-phone-modal__btn--submit"
              onClick={nextStep}
            >
              {t('changePhoneModal.confirm')}
            </button>
          ) : (
            <button
              key={3}
              disabled={!parsePhoneNumberFromString(phone)?.isValid()}
              type="button"
              className="change-phone-modal__btn change-phone-modal__btn--submit"
              onClick={nextStep}
            >
              {t('changePhoneModal.change')}
            </button>
          ),
        ]}
      />
    </WithBackground>
  );
};
