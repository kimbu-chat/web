import React from 'react';

import { AsYouType } from 'libphonenumber-js';
import noop from 'lodash/noop';
import { useTranslation } from 'react-i18next';

import { ICountry } from '@common/country';
import { ErrorTooltip } from '@components/error-tooltip';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

import './phone-input.scss';

interface IPhoneInputProps {
  country?: ICountry;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  displayCountries: () => void;
  submitFunction?: () => void;
  icon?: JSX.Element;
  errorText?: string | null;
}

export const PhoneInput = React.forwardRef(
  (
    {
      country,
      phone,
      setPhone,
      displayCountries,
      submitFunction = noop,
      icon,
      errorText,
    }: IPhoneInputProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { t } = useTranslation();

    return (
      <div className="phone-input">
        <input
          onClick={displayCountries}
          type="text"
          className="phone-input__country-code"
          readOnly
          value={country?.number}
        />
        <span className="phone-input__label">{t('phoneInputGroup.phone')}</span>
        <input
          ref={ref}
          placeholder={t('phoneInputGroup.phone')}
          value={removeCountryCodeFromPhoneNumber(
            country?.number || '',
            new AsYouType().input(phone),
          )}
          onChange={(e) => {
            setPhone(new AsYouType().input(country?.number + e.target.value));
          }}
          className="phone-input__input"
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === 'Enter' && submitFunction()
          }
        />
        <div className="phone-input__bg" />
        <div className="phone-input__icon-holder">{icon}</div>
        {errorText && <ErrorTooltip>{errorText}</ErrorTooltip>}
      </div>
    );
  },
);
