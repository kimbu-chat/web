import React, { useCallback, useState, useRef, useEffect, Suspense } from 'react';
import './phone-confirmation.scss';
import { BaseBtn, WithBackground, FadeAnimationWrapper, PrivacyPolicy } from '@components/shared';
import { CountrySelect, PhoneInput } from '@components/login-page';
import { countryList } from '@common/countries';
import { ICountry } from '@common/country';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import * as AuthActions from '@store/auth/actions';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getCountryByIp } from '@utils/get-country-by-ip';
import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { authLoadingSelector } from '@store/auth/selectors';

interface IPhoneConfirmationProps {
  preloadNext: () => void;
}

const PhoneConfirmation: React.FC<IPhoneConfirmationProps> = ({ preloadNext }) => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  const history = useHistory();

  const isLoading = useSelector(authLoadingSelector);

  const [country, setCountry] = useState<ICountry>(countryList[countryList.length - 1]);
  const [phone, setPhone] = useState<string>('');
  const [
    countrySelectRef,
    setCountrySelectRef,
  ] = useState<React.RefObject<HTMLInputElement> | null>(null);
  const [policyDisplayed, setPolicyDisplayed] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const sendSmsCode = useActionWithDeferred(AuthActions.sendSmsCode);
  const sendSms = useCallback(() => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber?.isValid()) {
      sendSmsCode({
        phoneNumber: phoneNumber.number as string,
        twoLetterCountryCode: country.code,
      }).then(() => {
        history.push('/confirm-code');
      });
    }
  }, [country.code, history, phone, sendSmsCode]);

  const changePolicyDisplayedState = useCallback(() => {
    setPolicyDisplayed((oldState) => !oldState);
  }, [setPolicyDisplayed]);

  const displayCountries = useCallback(() => {
    countrySelectRef?.current?.focus();
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    countrySelectRef?.current?.dispatchEvent(clickEvent);
  }, [countrySelectRef]);

  const focusPhoneInput = useCallback(() => {
    phoneInputRef.current?.focus();
  }, [phoneInputRef]);

  const handleCountryChange = useCallback(
    (newCountry: ICountry) => {
      setCountry((oldCountry) => {
        setPhone((oldPhone) => {
          focusPhoneInput();
          if (oldCountry.title.length > 0) {
            const onlyNumber = oldPhone.split(' ').join('').split(oldCountry.number)[1];
            const newCode = newCountry ? newCountry.number : '';
            return onlyNumber ? newCode + onlyNumber : newCode;
          }
          return newCountry ? newCountry.number + oldPhone : '';
        });
        return newCountry || oldCountry;
      });
    },
    [setCountry, setPhone, focusPhoneInput],
  );

  const setCurrentCountry = useCallback(async () => {
    const countryCode = await getCountryByIp();
    const currentCountry = countryList.find(({ code }) => code === countryCode) || countryList[0];
    setCountry(currentCountry);
  }, []);

  useEffect(() => {
    preloadNext();
    setCountry(countryList[0]);
    setCurrentCountry();
  }, [preloadNext, setCurrentCountry]);

  //! Temporal code
  // TODO:Remove im production
  const [areNumbersDisplayed, setNumbersDisplayed] = useState(false);
  const changeNumbersDisplayedState = useCallback(() => {
    setNumbersDisplayed((oldState) => !oldState);
  }, [setNumbersDisplayed]);

  return (
    <>
      <div className="phone-confirmation">
        <div className="phone-confirmation__container">
          <h1 className="phone-confirmation__logo">RAVUDI</h1>
          <p onClick={changeNumbersDisplayedState} className="phone-confirmation__confirm-phone">
            {t('loginPage.confirm_phone')}
          </p>
          {areNumbersDisplayed && (
            <>
              <p>+375445446331</p>
              <p>+375292725607</p>
              <p>+375445446388</p>
              <p>+375445446399</p>
            </>
          )}
          <div className="phone-confirmation__credentials">
            <CountrySelect
              setRef={setCountrySelectRef}
              country={country}
              handleCountryChange={handleCountryChange}
            />
            <PhoneInput
              ref={phoneInputRef}
              displayCountries={displayCountries}
              country={country}
              phone={phone}
              setPhone={setPhone}
              sendSms={sendSms}
            />
          </div>
          <BaseBtn
            disabled={isLoading || !parsePhoneNumberFromString(phone)?.isValid()}
            isLoading={isLoading}
            onClick={sendSms}
            variant="contained"
            color="primary"
            width="contained"
            className="phone-confirmation__btn">
            {t('loginPage.next')}
          </BaseBtn>
          <p className="phone-confirmation__conditions">
            {t('loginPage.agree_to')}
            <span onClick={changePolicyDisplayedState}>{t('loginPage.ravudi_terms')}</span>
          </p>
        </div>
      </div>
      <FadeAnimationWrapper isDisplayed={policyDisplayed}>
        <WithBackground onBackgroundClick={changePolicyDisplayedState}>
          <Suspense fallback={<CubeLoader />}>
            <PrivacyPolicy close={changePolicyDisplayedState} />
          </Suspense>
        </WithBackground>
      </FadeAnimationWrapper>
    </>
  );
};

export default PhoneConfirmation;
