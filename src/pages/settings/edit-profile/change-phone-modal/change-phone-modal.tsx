import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import parsePhoneNumberFromString from 'libphonenumber-js';
import useInterval from 'use-interval';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { ReactComponent as ChatSvg } from '@icons/single-chat.svg';
import { ReactComponent as CrayonSvg } from '@icons/crayon.svg';
import { WithBackground } from '@components/with-background';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { PhoneInputGroup } from '@components/phone-input-group';
import { LabeledInput } from '@components/labeled-input';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { confirmChangePhone, sendSmsChangePhone } from '@store/my-profile/actions';
import { getUserByPhoneAction } from '@store/friends/actions';

import './change-phone-modal.scss';

interface IChangePhoneModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'change-phone-modal';

const ChangePhoneModal: React.FC<IChangePhoneModalProps> = ({ onClose }) => {
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
          onClose();
        })
        .catch(() => {
          setLoading(false);
          setError('changePhoneModal.wrong-code');
        });
    }
  }, [confirmChange, code, phone, onClose]);

  useEffect(() => {
    setError(null);
  }, [phone, code]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          submited ? (
            <>
              <ChatSvg className={classNames(`${BLOCK_NAME}__icon`)} viewBox="0 0 24 24" />
              <span> {t('changePhoneModal.code-sent')} </span>
            </>
          ) : (
            <>
              <CrayonSvg className={classNames(`${BLOCK_NAME}__icon`)} viewBox="0 0 16 16" />
              <span> {t('changePhoneModal.change-number')} </span>
            </>
          )
        }
        content={
          <div className={classNames(BLOCK_NAME)}>
            <PhoneInputGroup
              submitFunction={sendCodeConfirmation}
              hideCountrySelect={submited}
              phone={phone}
              setPhone={setPhone}
              errorText={submited ? null : error && t(error)}
              phoneInputIcon={
                submited ? (
                  <button type="button" className={classNames(`${BLOCK_NAME}__back-icon`)}>
                    <CrayonSvg onClick={prevStep} viewBox="0 0 16 16" />
                  </button>
                ) : undefined
              }
            />

            {submited && (
              <>
                <LabeledInput
                  label={t('changePhoneModal.code')}
                  placeholder={t('changePhoneModal.enter-numbers')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  containerClassName={classNames(`${BLOCK_NAME}__input`)}
                  errorText={error && t(error)}
                />

                {remainedTime === 0 ? (
                  <Button
                    onClick={reSendCode}
                    themed
                    loading={resendLoading}
                    className={classNames(`${BLOCK_NAME}__resend`)}>
                    {t('changePhoneModal.resend')}
                  </Button>
                ) : (
                  <span className={classNames(`${BLOCK_NAME}__details`)}>
                    {t('changePhoneModal.details', {
                      time: dayjs.utc(remainedTime * 1000).format('mm:ss'),
                    })}
                  </span>
                )}
              </>
            )}
          </div>
        }
        closeModal={onClose}
        buttons={[
          !submited && (
            <button
              key={1}
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
              onClick={onClose}>
              {t('changePhoneModal.cancel')}
            </button>
          ),
          submited ? (
            <Button
              key={2}
              disabled={!/^[0-9]{4}$/.test(code)}
              loading={loading}
              onClick={confirm}
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--submit`)}>
              {t('changePhoneModal.confirm')}
            </Button>
          ) : (
            <Button
              key={3}
              disabled={!parsePhoneNumberFromString(phone)?.isValid()}
              type="button"
              loading={loading}
              onClick={sendCodeConfirmation}
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--submit`)}>
              {t('changePhoneModal.change')}
            </Button>
          ),
        ]}
      />
    </WithBackground>
  );
};

ChangePhoneModal.displayName = 'ChangePhoneModal';

export { ChangePhoneModal };
