import React, { useCallback, useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { Button } from '@components/button/button';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { PhoneInputGroup } from '@components/phone-input-group';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { SendSmsCode } from '@store/login/features/send-sms-code/send-sms-code';
import { authLoadingSelector } from '@store/login/selectors';

import './phone-confirmation.scss';

const LazyPrivacyPolicy = React.lazy(() => import('@components/privacy-policy'));
const BLOCK_NAME = 'phone-confirmation';

type PhoneConfirmationProps = {
  preloadNext: () => void;
};

const PhoneConfirmation: React.FC<PhoneConfirmationProps> = ({ preloadNext }) => {
  const { t } = useTranslation();

  const history = useHistory();

  const isLoading = useSelector(authLoadingSelector);

  const [phone, setPhone] = useState('');
  const [policyDisplayed, setPolicyDisplayed] = useState(false);

  const sendSmsCode = useActionWithDeferred(SendSmsCode.action);

  const sendSms = useCallback(() => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber?.isValid()) {
      sendSmsCode({
        phoneNumber: phoneNumber.number as string,
      }).then(() => {
        history.push('/confirm-code');
      });
    }
  }, [history, phone, sendSmsCode]);

  const changePolicyDisplayedState = useCallback(() => {
    setPolicyDisplayed((oldState) => !oldState);
  }, [setPolicyDisplayed]);

  useEffect(() => {
    preloadNext();
  }, [preloadNext]);

  return (
    <div className={BLOCK_NAME}>
      <div className={`${BLOCK_NAME}__container`}>
        <h1 className={`${BLOCK_NAME}__logo`}>RAVUDI</h1>
        <p className={`${BLOCK_NAME}__confirm-phone`}>{t('loginPage.confirm_phone')}</p>
        <div className={`${BLOCK_NAME}__credentials`}>
          <PhoneInputGroup phone={phone} setPhone={setPhone} />
        </div>
        <Button
          disabled={!parsePhoneNumberFromString(phone)?.isValid()}
          loading={isLoading}
          onClick={sendSms}
          className={`${BLOCK_NAME}__btn`}>
          {t('loginPage.next')}
        </Button>
        <p className={`${BLOCK_NAME}__conditions`}>
          {t('loginPage.agree_to')}
          <span onClick={changePolicyDisplayedState}>{t('loginPage.ravudi_terms')}</span>
        </p>
      </div>
      <FadeAnimationWrapper isDisplayed={policyDisplayed}>
        <Suspense fallback={<div>Loading</div>}>
          <LazyPrivacyPolicy close={changePolicyDisplayedState} />
        </Suspense>
      </FadeAnimationWrapper>
    </div>
  );
};

PhoneConfirmation.displayName = 'PhoneConfirmation';

export default PhoneConfirmation;
