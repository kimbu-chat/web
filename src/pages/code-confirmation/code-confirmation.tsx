import React, { useCallback, useEffect, useRef, useState } from 'react';

import { parsePhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AuthWrapper from '@auth-components/auth-wrapper/auth-wrapper';
import { CodeInput } from '@auth-components/code-input';
import { Portal } from '@auth-components/portal';
import { TooltipPopover } from '@auth-components/tooltip-popover';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { preloadAuthRoute } from '@routing/routes/auth-routes';
import { preloadMainRoute } from '@routing/routes/main-routes';
import { INSTANT_MESSAGING_PATH, SIGN_UP_PATH } from '@routing/routing.constants';
import { confirmPhoneAction, sendSmsCodeAction } from '@store/login/actions';
import {
  authLoadingSelector,
  authPhoneNumberSelector,
  confirmationCodeWrongSelector,
} from '@store/login/selectors';

import './code-confirmation.scss';

const BLOCK_NAME = 'code-confirmation';

// [mins, secs]
const DEFAULT_TIMEOUT = [1, 0];

const CodeConfirmation: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [[mins, secs], setTime] = useState(DEFAULT_TIMEOUT);
  const [done, setDone] = useState(false);
  const [resending, setResending] = useState(false);
  const codeInputRef = useRef<HTMLDivElement>(null);

  const preloadRoutes = () => {
    preloadMainRoute(INSTANT_MESSAGING_PATH);
    preloadAuthRoute(SIGN_UP_PATH);
  };

  useEffect(preloadRoutes, []);

  const tick = useCallback(() => {
    if (mins === 0 && secs === 0) {
      setDone(true);
    }
    if (mins !== 0 && secs === 0) {
      setTime([mins - 1, 59]);
    } else {
      setTime([mins, secs - 1]);
    }
  }, [mins, secs]);

  const reset = () => setTime(DEFAULT_TIMEOUT);

  useEffect(() => {
    const timerId = setInterval(tick, 1000);

    if (done) {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [tick, done]);

  const phoneNumber = useSelector(authPhoneNumberSelector);
  const isConfirmationCodeWrong = useSelector(confirmationCodeWrongSelector);
  const isLoading = useSelector(authLoadingSelector);

  const reSendSmsCode = useActionWithDeferred(sendSmsCodeAction);
  const checkConfirmationCode = useActionWithDeferred(confirmPhoneAction);

  const resendVerificationCode = useCallback(() => {
    setResending(true);
    reSendSmsCode({ phoneNumber }).then(() => setResending(false));
    setDone(false);
    reset();
  }, [phoneNumber, reSendSmsCode]);

  const sendCodeToVerify = useCallback(
    (code: string) => {
      checkConfirmationCode({ code, phoneNumber }).then((userRegistered) => {
        if (userRegistered) {
          history.push(INSTANT_MESSAGING_PATH);
        } else {
          history.push(SIGN_UP_PATH);
        }
      });
    },
    [checkConfirmationCode, history, phoneNumber],
  );

  return (
    <AuthWrapper>
      <div className={`${BLOCK_NAME}__pretext`}>
        {t('loginPage.confirm_code')}
        <br />
        {t('loginPage.confirm_code_phone_number')}
        <b>{parsePhoneNumber(phoneNumber).formatInternational()}</b>
      </div>
      <CodeInput
        loading={isLoading}
        onComplete={sendCodeToVerify}
        ref={codeInputRef}
        error={isConfirmationCodeWrong}
        resending={resending}
      />
      <p className={`${BLOCK_NAME}__another-code`}>
        {done ? (
          <>
            <span className={`${BLOCK_NAME}__send-me`} onClick={resendVerificationCode}>
              {t('loginPage.sendme')}
            </span>
            {t('loginPage.sendme_another')}
          </>
        ) : (
          <>
            {t('loginPage.another_code')}
            {mins}:{secs.toString().padStart(2, '0')}
          </>
        )}
      </p>

      {isConfirmationCodeWrong && (
        <Portal>
          <TooltipPopover className={`${BLOCK_NAME}__error-tooltip`} tooltipRef={codeInputRef}>
            {t('loginPage.wrong_code')}
          </TooltipPopover>
        </Portal>
      )}
    </AuthWrapper>
  );
};

export default CodeConfirmation;
