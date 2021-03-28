import { getCountryByIp } from '@utils/get-country-by-ip';
import { countryList } from '@common/countries';
import { ICountry } from '@common/country';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CountrySelect } from './country-select/country-select';
import './phone-input-group.scss';
import { PhoneInput } from './phone-input/phone-input';

interface IPhoneInputGroupProps {
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  hideCountrySelect?: boolean;
  submitFunction?: () => void;
  phone: string;
  phoneInputIcon?: JSX.Element | false;
}

const PhoneInputGroup: React.FC<IPhoneInputGroupProps> = ({
  setPhone,
  phone,
  submitFunction,
  hideCountrySelect,
  phoneInputIcon,
}) => {
  const [country, setCountry] = useState<ICountry>(countryList[countryList.length - 1]);
  const [
    countrySelectRef,
    setCountrySelectRef,
  ] = useState<React.RefObject<HTMLInputElement> | null>(null);

  useEffect(() => {
    setCountry(countryList[0]);
    (async () => {
      const countryCode = await getCountryByIp();
      const countryOfResidence =
        countryList.find(({ code }) => code === countryCode) || countryList[0];
      setCountry(countryOfResidence);
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
    (newCountry: ICountry) => {
      setCountry((oldCountry) => {
        setPhone((oldPhone) => {
          focusPhoneInput();
          if (oldCountry.title.length > 0) {
            const onlyNumber = oldPhone.split(' ').join('').split(oldCountry.number)[1];
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
      />
    </div>
  );
};

PhoneInputGroup.displayName = 'PhoneInputGroup';

export { PhoneInputGroup };
