import React, { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AuthWrapper from '@auth-components/auth-wrapper';
import { Portal } from '@auth-components/portal';
import { TooltipPopover } from '@auth-components/tooltip-popover';
import { Input } from '@components/input';
import { Loader } from '@components/loader';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { registerAction } from '@store/login/actions';
import { authLoadingSelector, authPhoneNumberSelector } from '@store/login/selectors';
import { checkNicknameAvailabilityAction } from '@store/my-profile/actions';
import { validateNickname } from '@utils/validate-nick-name';

import './sign-up.scss';

const BLOCK_NAME = 'sign-up-page';

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const phoneNumber = useSelector(authPhoneNumberSelector);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastname] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>();

  const usernameRef = useRef<HTMLDivElement>(null);

  const register = useActionWithDeferred(registerAction);
  const checkNicknameAvailability = useActionWithDeferred(checkNicknameAvailabilityAction);
  const isLoading = useSelector(authLoadingSelector);

  const registerUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const isNicknameValid = validateNickname(nickname);
      if (!isNicknameValid) {
        setError(t('register.nickname_invalid'));
        return;
      }

      checkNicknameAvailability({ nickname }).then(({ isAvailable }) => {
        if (isAvailable) {
          register({
            firstName,
            lastName,
            nickname,
          }).then(() => {
            history.push(INSTANT_MESSAGING_PATH);
          });
        } else {
          setError(t('register.already_in_use'));
        }
      });
    },
    [checkNicknameAvailability, firstName, history, lastName, nickname, register, t],
  );

  const onNicknameChange = useCallback((val: string) => {
    setNickname(val);
    setError('');
  }, []);

  return (
    <AuthWrapper>
      <form onSubmit={registerUser}>
        <div className={`${BLOCK_NAME}__pretext`}>
          {t('loginPage.confirm_code')}
          <br />
          {t('loginPage.confirm_code_phone_number')}
          <b>{phoneNumber}</b>
        </div>
        <Input
          autoFocus
          label={t('loginPage.name')}
          className={`${BLOCK_NAME}__input`}
          onChange={setFirstName}
        />
        <Input
          label={t('loginPage.last_name')}
          className={`${BLOCK_NAME}__input`}
          onChange={setLastname}
        />
        <Input
          prefix="@"
          label={t('loginPage.nick_name')}
          className={`${BLOCK_NAME}__input`}
          onChange={onNicknameChange}
          error={error}
          ref={usernameRef}
        />
        <button
          type="submit"
          disabled={!firstName && !nickname}
          className={`${BLOCK_NAME}__login-button`}>
          {isLoading ? <Loader /> : t('loginPage.next')}
        </button>

        {error && (
          <Portal>
            <TooltipPopover className={`${BLOCK_NAME}__error-tooltip`} tooltipRef={usernameRef}>
              {error}
            </TooltipPopover>
          </Portal>
        )}
      </form>
    </AuthWrapper>
  );
};

export default SignUpPage;
