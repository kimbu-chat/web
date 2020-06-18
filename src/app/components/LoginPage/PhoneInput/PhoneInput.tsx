import * as React from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

import TextField from '@material-ui/core/TextField';

import { countryInterface, countryList } from '../../../utils/countries';
import './PhoneInput.scss';

namespace PhoneInput {
  export interface Props {
    country: countryInterface | null;
    setCountry: Function;
    phone: string;
    setPhone: Function;
  }
}

export default function PhoneInput({ phone, setPhone, setCountry }: PhoneInput.Props) {
  const handlePhoneChange = (e: any) => {
    setPhone(new AsYouType().input(e.target.value));
    const phoneNumber = parsePhoneNumberFromString(e.target.value);
    setCountry((oldCountry: countryInterface | null) => {
      const result = countryList.find((elem) => elem.code === phoneNumber?.country);
      return result ? result : oldCountry;
    });
  };

  return (
    <div className="phone-input">
      <TextField
        value={phone}
        onChange={handlePhoneChange}
        className="phone-input__input"
        id="outlined-required"
        label="Phone"
        variant="outlined"
      />
    </div>
  );
}
