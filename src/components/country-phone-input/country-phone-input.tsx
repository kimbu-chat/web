import React, { useState, useCallback, useRef, useEffect } from 'react';
import find from 'lodash/find';
import { useTranslation } from 'react-i18next';
import { AsYouType } from 'libphonenumber-js';

import { ReactComponent as BelarusFlag } from '@flags/belarus.svg';
import { ReactComponent as ArrowDown } from '@icons/arrow-down.svg';
import { getCountryByIp } from '@utils/get-country-by-ip';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

import type { ICountry } from '@common/country';

import './country-phone-input.scss';

const BLOCK_NAME = 'country-phone-input';

type CountryPhoneInputProps = {
  onChange: (phone: string) => void;
  value: string;
};

export const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({ onChange, value }) => {
  const [code, setCode] = useState<string | undefined>('+375');
  const [countries, setCountries] = useState<ICountry[]>([]);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(`${code}${e.target.value}`);
    },
    [code, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (!ref.current?.contains(evt.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    const getCountries = async () => {
      const res = await fetch('/countries.json');
      const countriesResp = await res.json();
      const countryCode = await getCountryByIp();
      setCountries(countriesResp);
      setCode(find(countriesResp, { code: countryCode })?.number);
    };
    getCountries();
  }, []);

  const toggle = useCallback(() => {
    setOpen((opened) => !opened);
  }, []);

  const onSelect = useCallback((e: React.SyntheticEvent<HTMLUListElement>) => {
    setCode((e.target as HTMLLIElement).dataset.code);
    setOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div className={BLOCK_NAME} ref={ref}>
      <div className={`${BLOCK_NAME}__input-container`}>
        <button className={`${BLOCK_NAME}__code-btn`} onClick={toggle} type="button">
          <BelarusFlag className={`${BLOCK_NAME}__flag-icon`} />
          <span className={`${BLOCK_NAME}__country-code`}>{code}</span>
          <ArrowDown />
        </button>
        <span className={`${BLOCK_NAME}__separator`} />
        <input
          autoFocus
          className={`${BLOCK_NAME}__input`}
          placeholder={t('loginPage.mobile_phone')}
          type="tel"
          pattern="(\+?\d[- .]*){7,13}"
          ref={inputRef}
          onChange={onPhoneChange}
          value={removeCountryCodeFromPhoneNumber(code, new AsYouType().input(value))}
        />
      </div>
      {open && (
        <ul className={`${BLOCK_NAME}__list`} onClick={onSelect}>
          {countries.map((item) => (
            <li data-code={item.number} key={item.code} className={`${BLOCK_NAME}__list-item`}>
              <BelarusFlag className={`${BLOCK_NAME}__flag-icon`} />
              <span className={`${BLOCK_NAME}__list-item-code`}>{item.number}</span>
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
