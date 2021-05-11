import React, { useCallback, useState, useEffect } from 'react';
import './phone-confirmation.scss';
import { FadeAnimationWrapper, PrivacyPolicy, Button } from '@components/shared';

import { useTranslation } from 'react-i18next';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { sendSmsCodeAction } from '@store/auth/actions';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { authLoadingSelector } from '@store/auth/selectors';
import { PhoneInputGroup } from '@components/messenger-page';

interface IPhoneConfirmationProps {
  preloadNext: () => void;
}

const PhoneConfirmation: React.FC<IPhoneConfirmationProps> = ({ preloadNext }) => {
  const { t } = useTranslation();

  const history = useHistory();

  const isLoading = useSelector(authLoadingSelector);

  const [phone, setPhone] = useState<string>('');
  const [policyDisplayed, setPolicyDisplayed] = useState(false);

  const sendSmsCode = useActionWithDeferred(sendSmsCodeAction);
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
    <>
      <div className="phone-confirmation">
        <div className="phone-confirmation__container">
          <h1 className="phone-confirmation__logo">RAVUDI</h1>
          <p className="phone-confirmation__confirm-phone">{t('loginPage.confirm_phone')}</p>
          <div className="phone-confirmation__credentials">
            <PhoneInputGroup phone={phone} setPhone={setPhone} />
          </div>
          <Button
            disabled={!parsePhoneNumberFromString(phone)?.isValid()}
            loading={isLoading}
            onClick={sendSms}
            className="phone-confirmation__btn">
            {t('loginPage.next')}
          </Button>
          <p className="phone-confirmation__conditions">
            {t('loginPage.agree_to')}
            <span onClick={changePolicyDisplayedState}>{t('loginPage.ravudi_terms')}</span>
          </p>
        </div>
        <FadeAnimationWrapper isDisplayed={policyDisplayed}>
          <PrivacyPolicy close={changePolicyDisplayedState} />
        </FadeAnimationWrapper>
      </div>
    </>
  );
};

PhoneConfirmation.displayName = 'PhoneConfirmation';

export default PhoneConfirmation;
