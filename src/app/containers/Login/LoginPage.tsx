import React from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import './LoginPage.scss';
import CountrySelect from '../../components/LoginPage/CountrySelect/CountrySelect';
import PhoneInput from '../../components/LoginPage/PhoneInput/PhoneInput';
import { history } from '../../../main';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { country } from 'app/utils/countries';
import { sendSmsPhoneConfirmationCodeAction, confirmPhoneAction } from 'app/store/auth/actions';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';

namespace LogPage {
  export enum Stages {
    phoneInput = 1,
    codeInput,
    registration
  }
}

export default function LoginPage() {
  const [country, setCountry] = React.useState<null | country>(null);
  const [phone, setPhone] = React.useState<string>('');
  const [stage, setStage] = React.useState<LogPage.Stages>(LogPage.Stages.phoneInput);
  const [code, setCode] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const codeFromServer = useSelector<AppState, string>((rootState) => rootState.auth.confirmationCode);
  const isConfirmationCodeWrong = useSelector<AppState, boolean>((rootState) => rootState.auth.isConfirmationCodeWrong);

  const sendSmsCode = useActionWithDeferred(sendSmsPhoneConfirmationCodeAction);
  const checkConfirmationCode = useActionWithDeferred(confirmPhoneAction);

  const sendSms = async () => {
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (phoneNumber?.isValid()) {
      setError('');

      sendSmsCode<string>({ phoneNumber: phoneNumber?.number.toString() }).then((code) => {
        setStage(2);
      });
    } else {
      setError('Phone is not valid');
    }
  };

  const checkCode = async () => {
    checkConfirmationCode({ code, phoneNumber: parsePhoneNumberFromString(phone)?.number?.toString() || '' }).then(
      () => {
        history.push('/messenger');
      }
    );
  };

  return (
    <div className="login-page">
      {stage === LogPage.Stages.phoneInput && (
        <div className="login-page__container">
          <img src="" alt="" className="login-page__logo" />
          <h1>Sign in to Kimbu</h1>
          <p>Please confirm your country code and enter your phone number.</p>
          <CountrySelect country={country} setCountry={setCountry} setPhone={setPhone} />
          <PhoneInput phone={phone} setPhone={setPhone} country={country} setCountry={setCountry} />
          <div className="login-page__button-container">
            <Button onClick={sendSms} className="login-page__button" variant="contained" color="primary">
              Log In
            </Button>
          </div>
          {error && <p>{error}</p>}
        </div>
      )}
      {stage === LogPage.Stages.codeInput && (
        <div className="login-page__container">
          {codeFromServer && <p>Code: {codeFromServer}</p>}
          <h1>Sign in to Kimbu</h1>
          <p>Please enter received code.</p>
          <div className="login-page__code-input">
            <TextField
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="phone-input__input"
              id="outlined-required"
              label="Code"
              variant="outlined"
            />
            <div className="login-page__button-container">
              <Button onClick={checkCode} className="login-page__check-button" variant="contained" color="primary">
                Start Messaging
              </Button>
            </div>
          </div>
          {isConfirmationCodeWrong && <p>Code is wrong</p>}
        </div>
      )}
      {stage === LogPage.Stages.registration && (
        <div className="login-page__container">
          <h1>Sign in to Kimbu</h1>
          <p>Please pass registration</p>
        </div>
      )}
    </div>
  );
}
