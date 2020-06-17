import React from 'react';
import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import './LoginPage.scss';
import CountrySelect from './CountrySelect/CountrySelect';
import PhoneInput from './PhoneInput/PhoneInput';
import { baseUrl } from '../../utils/axios';
import { history } from '../../../main';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { countryInterface } from 'app/utils/countries';

export interface IAppProps {}

export default function LoginPage(props: IAppProps) {
  const [country, setCountry] = React.useState<null | countryInterface>(null);
  const [phone, setPhone] = React.useState<string>('');
  const [stage, setStage] = React.useState(1);
  const [code, setCode] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  const sendSms = async () => {
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (phoneNumber?.isValid()) {
      setError('');
      const res = await axios({
        method: 'post',
        url: baseUrl + '/api/users/send-sms-confirmation-code',
        data: {
          phoneNumber: phoneNumber?.number
        }
      });

      if (res.status === 200) {
        setStage(2);
      }
    } else {
      setError('Phone is not valid');
    }
  };

  const checkCode = async () => {
    const res = await axios({
      method: 'post',
      url: baseUrl + '/api/users/verify-sms-code',
      data: {
        phoneNumber: parsePhoneNumberFromString(phone)?.number,
        code: code
      }
    });

    if (res.data.isCodeCorrect && res.data.userExists) {
      history.push('/messenger');
    } else if (!res.data.isCodeCorrect) {
      setError('Code is Wrong');
    } else {
      setStage(3);
    }
  };

  return (
    <div className="login-page">
      {stage === 1 && (
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
      {stage === 2 && (
        <div className="login-page__container">
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
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}
