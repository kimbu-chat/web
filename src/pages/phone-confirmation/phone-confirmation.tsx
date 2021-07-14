import React, { useState, useCallback, Suspense, useEffect, useLayoutEffect } from 'react';

import parsePhoneNumberFromString from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AuthWrapper from '@components/auth-wrapper';
import { Button } from '@components/button';
import { CountryPhoneInput } from '@components/country-phone-input';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { preloadAuthRoute } from '@routing/routes/auth-routes';
import { CODE_CONFIRMATION_PATH } from '@routing/routing.constants';
import { sendSmsCodeAction } from '@store/login/actions';
import { authLoadingSelector } from '@store/login/selectors';

import { useToggledState } from '../../hooks/use-toggled-state';

import './phone-confirmation.scss';

const BLOCK_NAME = 'phone-confirmation';

const loadPrivacyPolicy = () => import('@components/privacy-policy');

const LazyPrivacyPolicy = React.lazy(loadPrivacyPolicy);

const PhoneConfirmationPage: React.FC = () => {
  const { t } = useTranslation();

  useLayoutEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const history = useHistory();

  const isLoading = useSelector(authLoadingSelector);

  const [phone, setPhone] = useState('');
  const [policyDisplayed, , , changePolicyDisplayedState] = useToggledState(false);

  const sendSmsCode = useActionWithDeferred(sendSmsCodeAction);

  useEffect(() => preloadAuthRoute(CODE_CONFIRMATION_PATH), []);

  const sendSms = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber?.isValid()) {
        sendSmsCode({
          phoneNumber: phoneNumber.number as string,
        }).then(() => {
          history.push(CODE_CONFIRMATION_PATH);
        });
      }
    },
    [history, phone, sendSmsCode],
  );

  return (
    <AuthWrapper>
      <form onSubmit={sendSms}>
        <p className={`${BLOCK_NAME}__slogan-pretext`}>
          {t('loginPage.stay_connected')}
          <br />
          {t('loginPage.new_experience')}
        </p>
        <div className={`${BLOCK_NAME}__login-form`}>
          <CountryPhoneInput onChange={setPhone} value={phone} />
          <Button type="submit" loading={isLoading} className={`${BLOCK_NAME}__login-button`}>
            {t('loginPage.next')}
          </Button>
        </div>
        <p className={`${BLOCK_NAME}__conditions`}>
          {t('loginPage.agree_to')}
          <span onClick={changePolicyDisplayedState}>{t('loginPage.kimbu_terms')}</span>
          {policyDisplayed && (
            <Suspense fallback={<span>Loading</span>}>
              <LazyPrivacyPolicy close={changePolicyDisplayedState} />
            </Suspense>
          )}
        </p>
      </form>
    </AuthWrapper>
  );
};

export default PhoneConfirmationPage;
