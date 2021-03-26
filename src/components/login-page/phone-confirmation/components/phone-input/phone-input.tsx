import React, { useContext } from 'react';
import { AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { ICountry } from '@common/country';
import { LocalizationContext } from '@contexts';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

interface IPhoneInputProps {
  country: ICountry;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  displayCountries: () => void;
  sendSms: () => void;
}

export const PhoneInput = React.forwardRef(
  ({ country, phone, setPhone, displayCountries, sendSms }: IPhoneInputProps, ref: React.Ref<HTMLInputElement>) => {
    const { t } = useContext(LocalizationContext);

    return (
      <div className="phone-input">
        <input onClick={displayCountries} type="text" className="phone-input__country-code" readOnly value={country.number} />
        <input
          ref={ref}
          placeholder={t('loginPage.phone')}
          value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(phone))}
          onChange={(e) => {
            setPhone(new AsYouType().input(country.number + e.target.value));
          }}
          className="phone-input__input"
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && sendSms()}
        />
      </div>
    );
  },
);
