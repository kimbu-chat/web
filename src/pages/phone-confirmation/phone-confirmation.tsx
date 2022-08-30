import React, { Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { ApplicationErrorCode } from 'kimbu-models';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CountryPhoneInput } from '@auth-components/country-phone-input';
import { CubeLoader } from '@components/cube-loader';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useToggledState } from '@hooks/use-toggled-state';
import { preloadAuthRoute } from '@routing/routes/auth-routes';
import {
  CODE_CONFIRMATION_PATH,
  INSTANT_MESSAGING_PATH,
  SIGN_UP_PATH,
} from '@routing/routing.constants';
import { Button } from '@shared-components/button';
import { loginFromGoogleAccountAction, sendSmsCodeAction } from '@store/login/actions';
import { LoginFromGoogleAccountResult } from '@store/login/features/login-from-google-account/login-from-google-account';
import { authLoadingSelector, googleAuthLoadingSelector } from '@store/login/selectors';
import { emitToast } from '@utils/emit-toast';

import AuthWrapper from '../../auth-components/auth-wrapper';

import './phone-confirmation.scss';

const BLOCK_NAME = 'phone-confirmation';

const loadPrivacyPolicy = () => import('@auth-components/privacy-policy');

const LazyPrivacyPolicy = React.lazy(loadPrivacyPolicy);

const googleErrors = new Map<LoginFromGoogleAccountResult, string>([
  [LoginFromGoogleAccountResult.GoogleAuthDisabled, 'googleAuth.disabled'],
  [LoginFromGoogleAccountResult.NetworkError, 'network-error'],
  [LoginFromGoogleAccountResult.IdTokenInvalid, 'googleAuth.id_token_invalid'],
  [LoginFromGoogleAccountResult.UnknownError, 'something_went_wrong'],
]);

const PhoneConfirmationPage: React.FC = () => {
  const { t } = useTranslation();

  useLayoutEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const navigate = useNavigate();

  const isLoading = useSelector(authLoadingSelector);

  const googleAuthLoading = useSelector(googleAuthLoadingSelector);

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
        })
          .then(() => {
            navigate(CODE_CONFIRMATION_PATH);
          })
          .catch((err: ApplicationErrorCode) => {
            setPhone('');
            if (err === ApplicationErrorCode.LoginByPhoneNumberDisabled) {
              emitToast(t('loginPage.log_in_by_phone_number_disabled'), { type: 'error' });
            } else {
              emitToast(t('something_went_wrong'), { type: 'error' });
            }
          });
      }
    },
    [navigate, phone, sendSmsCode, t],
  );

  const handleLoginFromGoogle = useCallback(
    ({ credential }: CredentialResponse) => {
      if (!credential) return;
      loginFromGoogleAccount({ idToken: credential })
        .then(() => {
          navigate(INSTANT_MESSAGING_PATH);
        })
        .catch((result: LoginFromGoogleAccountResult) => {
          if (result === LoginFromGoogleAccountResult.UserNotRegistered) {
            navigate(SIGN_UP_PATH);
          } else {
            emitToast(t(googleErrors.get(result) as string), { type: 'error' });
          }
        });
    },
    [navigate, loginFromGoogleAccount, t],
  );

  const handleGoogleAuthError = useCallback(() => {
    emitToast(t('something_went_wrong'), { type: 'error' });
  }, [t]);

  if (googleAuthLoading) {
    return <CubeLoader />;
  }

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
        <div className={`${BLOCK_NAME}__social-title`}>{t('loginPage.social')}</div>
        <GoogleLogin
          ux_mode="popup"
          onSuccess={handleLoginFromGoogle}
          onError={handleGoogleAuthError}
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
