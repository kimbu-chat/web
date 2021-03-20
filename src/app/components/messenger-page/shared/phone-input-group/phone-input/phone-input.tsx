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
  submitFunction?: () => void;
}

export const PhoneInput = React.forwardRef(
  ({ country, phone, setPhone, displayCountries, submitFunction }: IPhoneInputProps, ref: React.Ref<HTMLInputElement>) => {
    const { t } = useContext(LocalizationContext);

    return (
      <div className='phone-input'>
        <input onClick={displayCountries} type='text' className='phone-input__country-code' readOnly value={country.number} />
        <div className='country-select__label'>{t('phoneInputGroup.phone')}</div>
        <input
          ref={ref}
          placeholder={t('phoneInputGroup.phone')}
          value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(phone))}
          onChange={(e) => {
            setPhone(new AsYouType().input(country.number + e.target.value));
          }}
          className='phone-input__input'
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && submitFunction && submitFunction()}
        />
      </div>
    );
  },
);
