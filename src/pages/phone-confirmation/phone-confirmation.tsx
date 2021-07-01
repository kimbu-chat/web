import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { authLoadingSelector } from '@store/login/selectors';
import { CountryPhoneInput } from '@components/country-phone-input';
import { Loader } from '@components/loader';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { sendSmsCodeAction } from '@store/login/actions';
import AuthWrapper from '@components/auth-wrapper';
import { CODE_CONFIRMATION_PATH } from '@routing/routing.constants';
import { preloadAuthRoute } from '@routing/routes/auth-routes';

import './phone-confirmation.scss';
import { useToggledState } from '../../hooks/use-toggled-state';

const BLOCK_NAME = 'phone-confirmation';

const LazyPrivacyPolicy = React.lazy(() => import('@components/privacy-policy'));

const PhoneConfirmationPage: React.FC = () => {
  const { t } = useTranslation();

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
          <button type="submit" className={`${BLOCK_NAME}__login-button`}>
            {isLoading ? <Loader /> : t('loginPage.next')}
          </button>
        </div>
        <p className={`${BLOCK_NAME}__conditions`}>
          {t('loginPage.agree_to')}
          <span onClick={changePolicyDisplayedState}>{t('loginPage.kimbu_terms')}</span>
        </p>
        {policyDisplayed && (
          <Suspense fallback={<div>Loading</div>}>
            <LazyPrivacyPolicy close={changePolicyDisplayedState} />
          </Suspense>
        )}
      </form>
    </AuthWrapper>
  );
};

export default PhoneConfirmationPage;
