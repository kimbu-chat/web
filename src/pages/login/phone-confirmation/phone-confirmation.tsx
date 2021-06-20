import React, { useState, useCallback, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { authLoadingSelector } from '@store/login/selectors';
import { CountryPhoneInput } from '@components/country-phone-input';
import { Loader } from '@components/loader';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { sendSmsCodeAction } from '@store/login/actions';

import './phone-confirmation.scss';

const BLOCK_NAME = 'phone-confirmation';

const LazyPrivacyPolicy = React.lazy(() => import('@components/privacy-policy'));

const PhoneConfirmationPage: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const isLoading = useSelector(authLoadingSelector);

  const [phone, setPhone] = useState('');
  const [policyDisplayed, setPolicyDisplayed] = useState(false);

  const sendSmsCode = useActionWithDeferred(sendSmsCodeAction);

  const sendSms = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber?.isValid()) {
        sendSmsCode({
          phoneNumber: phoneNumber.number as string,
        }).then(() => {
          history.push('/code-confirmation');
        });
      }
    },
    [history, phone, sendSmsCode],
  );

  const changePolicyDisplayedState = useCallback(() => {
    setPolicyDisplayed((oldState) => !oldState);
  }, [setPolicyDisplayed]);

  return (
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
      <FadeAnimationWrapper isDisplayed={policyDisplayed}>
        <Suspense fallback={<div>Loading</div>}>
          <LazyPrivacyPolicy close={changePolicyDisplayedState} />
        </Suspense>
      </FadeAnimationWrapper>
    </form>
  );
};

export default PhoneConfirmationPage;
