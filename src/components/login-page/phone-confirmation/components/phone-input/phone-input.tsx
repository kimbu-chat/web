import React from 'react';
import { AsYouType } from 'libphonenumber-js';
import './phone-input.scss';

import { ICountry } from '@common/country';
import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

interface IPhoneInputProps {
  country: ICountry;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  displayCountries: () => void;
  sendSms: () => void;
}

export const PhoneInput = React.forwardRef(
  (
    { country, phone, setPhone, displayCountries, sendSms }: IPhoneInputProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

    return (
      <div className="phone-input">
        <input
          onClick={displayCountries}
          type="text"
          className="phone-input__country-code"
          readOnly
          value={country.number}
        />
        <input
          ref={ref}
          placeholder={t('loginPage.phone')}
          value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(phone))}
          onChange={(e) => {
            setPhone(new AsYouType().input(country.number + e.target.value));
          }}
          className="phone-input__input"
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === 'Enter' && sendSms()
          }
        />
      </div>
    );
  },
);
