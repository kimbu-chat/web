import React, { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import useInterval from 'use-interval';

import { LabeledInput } from '@components/labeled-input';
import { IModalChildrenProps, Modal } from '@components/modal';
import { PhoneInputGroup } from '@components/phone-input-group';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { ReactComponent as ChatSvg } from '@icons/single-chat.svg';
import { Button } from '@shared-components/button';
import { getUserByPhoneAction } from '@store/friends/actions';
import { confirmChangePhone, sendSmsChangePhone } from '@store/my-profile/actions';
import { getMinutesSeconds } from '@utils/date-utils';

import './change-phone-modal.scss';

interface IChangePhoneModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'change-phone-modal';

const InitialChangePhoneModal: React.FC<IChangePhoneModalProps & IModalChildrenProps> = ({
                                                                                           animatedClose,
                                                                                         }) => {
  const { t } = useTranslation();

  const sendSms = useActionWithDeferred(sendSmsChangePhone);
  const getUserByPhone = useActionWithDeferred(getUserByPhoneAction);
  const confirmChange = useActionWithDeferred(confirmChangePhone);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [remainedTime, setRemainedTime] = useState(60);

  useInterval(() => {
    if (submited && remainedTime > 0) {
      setRemainedTime((old) => old - 1);
    }
  }, 1000);

  const prevStep = useCallback(() => {
    setSubmited(false);
  }, [setSubmited]);

  const sendCodeConfirmation = useCallback(() => {
    setLoading(true);
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber?.number) {
      getUserByPhone({ phone: phoneNumber.number as string }).then((response) => {
        if (response) {
          setLoading(false);
          setError('changePhoneModal.user-exists');
        } else {
          sendSms({ phone: phoneNumber.number as string })
            .then(() => {
              setLoading(false);
              setSubmited(true);
              setRemainedTime(60);
              setError(null);
            })
            .catch(() => {
              setLoading(false);
              setError('changePhoneModal.something-wrong');
            });
        }
      });
    }
  }, [phone, getUserByPhone, sendSms]);

  const reSendCode = useCallback(() => {
    setResendLoading(true);
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber?.number) {
      sendSms({ phone: phoneNumber.number as string })
        .then(() => {
          setResendLoading(false);
          setSubmited(true);
          setRemainedTime(60);
          setError(null);
        })
        .catch(() => {
          setResendLoading(false);
          setError('changePhoneModal.something-wrong');
        });
    }
  }, [phone, sendSms]);

  const confirm = useCallback(() => {
    setLoading(true);
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber?.number) {
      confirmChange({ phoneNumber: phoneNumber.number as string, confirmationCode: code })
        .then(() => {
          setLoading(false);
          animatedClose();
        })
        .catch(() => {
          setLoading(false);
          setError('changePhoneModal.wrong-code');
        });
    }
  }, [confirmChange, code, phone, animatedClose]);

  useEffect(() => {
    setError(null);
  }, [phone, code]);

  return (
    <>
      <Modal.Header>
        {submited ? (
          <>
            <ChatSvg className={`${BLOCK_NAME}__icon`} />
            <span> {t('changePhoneModal.code-sent')} </span>
          </>
        ) : (
          <>
            <CrayonSvg className={`${BLOCK_NAME}__icon`} />
            <span> {t('changePhoneModal.change-number')} </span>
          </>
        )}
      </Modal.Header>
      <div className={BLOCK_NAME}>
        <PhoneInputGroup
          submitFunction={sendCodeConfirmation}
          hideCountrySelect={submited}
          disablePhoneInput={submited}
          phone={phone}
          setPhone={setPhone}
          errorText={submited ? null : error && t(error)}
          phoneInputIcon={
            submited ? (
              <button type='button' className={`${BLOCK_NAME}__back-icon`}>
                <CrayonSvg onClick={prevStep} />
              </button>
            ) : undefined
          }
        />

        {submited && (
          <>
            <LabeledInput
              autoFocus
              label={t('changePhoneModal.code')}
              placeholder={t('changePhoneModal.enter-numbers')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              containerClassName={`${BLOCK_NAME}__input`}
              errorText={error && t(error)}
            />

            {remainedTime === 0 ? (
              <Button
                onClick={reSendCode}
                themed
                loading={resendLoading}
                className={`${BLOCK_NAME}__resend`}>
                {t('changePhoneModal.resend')}
              </Button>
            ) : (
              <span className={`${BLOCK_NAME}__details`}>
                {t('changePhoneModal.details', {
                  time: getMinutesSeconds(remainedTime),
                })}
              </span>
            )}
          </>
        )}

        <div className={`${BLOCK_NAME}__btn-block`}>
          {submited ? (
            <Button
              disabled={!/^[0-9]{4}$/.test(code)}
              loading={loading}
              onClick={confirm}
              type='button'
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--submit`)}>
              {t('changePhoneModal.confirm')}
            </Button>
          ) : (
            <>
              <button
                type='button'
                className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
                onClick={animatedClose}>
                {t('changePhoneModal.cancel')}
              </button>
              <Button
                disabled={!parsePhoneNumberFromString(phone)?.isValid()}
                type='button'
                loading={loading}
                onClick={sendCodeConfirmation}
                className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--submit`)}>
                {t('changePhoneModal.change')}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const ChangePhoneModal: React.FC<IChangePhoneModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialChangePhoneModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

ChangePhoneModal.displayName = 'ChangePhoneModal';

export { ChangePhoneModal };
