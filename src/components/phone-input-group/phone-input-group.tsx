import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CountrySelect } from '@components/country-select/country-select';
import { PhoneInput } from '@components/phone-input/phone-input';
import { getCountryByIp } from '@utils/get-country-by-ip';

import type { ICountry } from '@common/country';

import './phone-input-group.scss';

interface IPhoneInputGroupProps {
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  hideCountrySelect?: boolean;
  disablePhoneInput?: boolean;
  submitFunction?: () => void;
  phone: string;
  phoneInputIcon?: JSX.Element;
  errorText?: string | null;
}

const PhoneInputGroup: React.FC<IPhoneInputGroupProps> = ({
  setPhone,
  phone,
  submitFunction,
  hideCountrySelect,
  phoneInputIcon,
  errorText,
  disablePhoneInput,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([
    { code: 'AF', number: '+93', title: 'Afghanistan' },
  ]);
  const [country, setCountry] = useState<ICountry>({
    code: 'AF',
    number: '+93',
    title: 'Afghanistan',
  });
  const [countrySelectRef, setCountrySelectRef] =
    useState<React.RefObject<HTMLInputElement> | null>(null);

  useEffect(() => {
    (async () => {
      const loadedCountriesResponse = await fetch(`/countries.json`);
      const loadedCountries: ICountry[] = await loadedCountriesResponse.json();
      setCountries(loadedCountries);
      setCountry(loadedCountries[0]);
      const countryCode = await getCountryByIp();
      const countryOfResidence =
        loadedCountries?.find(({ code }) => code === countryCode) || loadedCountries[0];

      if (countryOfResidence) {
        setCountry(countryOfResidence);
      }
    })();
  }, []);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const displayCountries = useCallback(() => {
    countrySelectRef?.current?.focus();
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    countrySelectRef?.current?.dispatchEvent(clickEvent);
  }, [countrySelectRef]);

  const focusPhoneInput = useCallback(() => {
    phoneInputRef.current?.focus();
  }, [phoneInputRef]);

  const handleCountryChange = useCallback(
    (newCountry: ICountry | null) => {
      setCountry((oldCountry) => {
        setPhone((oldPhone) => {
          focusPhoneInput();
          if (oldCountry?.title.length) {
            const onlyNumber = oldPhone.split(' ').join('').split(oldCountry?.number)[1];
            const newCode = newCountry ? newCountry.number : '';
            return onlyNumber ? newCode + onlyNumber : newCode;
          }
          return newCountry ? newCountry.number + oldPhone : '';
        });
        return newCountry || oldCountry;
      });
    },
    [setCountry, setPhone, focusPhoneInput],
  );

  return (
    <div className="phone-input-group">
      {!hideCountrySelect && (
        <CountrySelect
          setRef={setCountrySelectRef}
          country={country}
          countries={countries}
          handleCountryChange={handleCountryChange}
        />
      )}
      <PhoneInput
        icon={phoneInputIcon}
        ref={phoneInputRef}
        displayCountries={displayCountries}
        country={country}
        phone={phone}
        setPhone={setPhone}
        submitFunction={submitFunction}
        errorText={errorText}
        disabled={disablePhoneInput}
      />
    </div>
  );
};

PhoneInputGroup.displayName = 'PhoneInputGroup';

export { PhoneInputGroup };
