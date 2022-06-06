import React, {Suspense, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {GoogleLogin} from '@react-oauth/google';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {CountryPhoneInput} from '@auth-components/country-phone-input';
import {useActionWithDeferred} from '@hooks/use-action-with-deferred';
import {useToggledState} from '@hooks/use-toggled-state';
import {preloadAuthRoute} from '@routing/routes/auth-routes';
import {CODE_CONFIRMATION_PATH, SIGN_UP_PATH} from '@routing/routing.constants';
import {Button} from '@shared-components/button';
import {loginFromGoogleAccountAction, sendSmsCodeAction} from '@store/login/actions';
import {authLoadingSelector} from '@store/login/selectors';

import AuthWrapper from '../../auth-components/auth-wrapper';

import './phone-confirmation.scss';
import {LoginFromGoogleAccountResult} from "@store/login/features/login-from-google-account/login-from-google-account";
import {emitToast} from "@utils/emit-toast";

const BLOCK_NAME = 'phone-confirmation';

const loadPrivacyPolicy = () => import('@auth-components/privacy-policy');

const LazyPrivacyPolicy = React.lazy(loadPrivacyPolicy);

const googleErrors = new Map<LoginFromGoogleAccountResult, string>([
  [LoginFromGoogleAccountResult.GoogleAuthDisabled, "Google auth disabled"],
  [LoginFromGoogleAccountResult.NetworkError, "Network Error, try later"],
  [LoginFromGoogleAccountResult.IdTokenInvalid, "Failed to log in, try later"],
  [LoginFromGoogleAccountResult.UnknownError, "Failed to log in, try later"],
]);

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

  const loginFromGoogleAccount = useActionWithDeferred(loginFromGoogleAccountAction);

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


  const handleLoginFromGoogle = useCallback(({ credential }) => {
    loginFromGoogleAccount({idToken: credential})
      .then()
      .catch((result: LoginFromGoogleAccountResult) => {
        if(googleErrors.has(result)){
          emitToast(googleErrors.get(result), { type: 'error' });
        } else if(result === LoginFromGoogleAccountResult.UserNotRegistered){
          history.push(SIGN_UP_PATH);
        }
      });
  }, [])

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
        <div className={`${BLOCK_NAME}__social-title`}>Sign in with:</div>
        <GoogleLogin
          ux_mode="popup"
          onSuccess={handleLoginFromGoogle}
          onError={() => {
            console.log('Login Failed');
          }}
        />

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
