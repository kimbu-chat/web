import React, { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';

import { AsYouType } from 'libphonenumber-js';
import find from 'lodash/find';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowDown } from '@icons/arrow-down.svg';
import { ReactComponent as SearchSvg } from '@icons/search.svg';
import { getCountryByIp } from '@utils/get-country-by-ip';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

import type { ICountry } from '@common/country';

import './country-phone-input.scss';

const BLOCK_NAME = 'country-phone-input';

type CountryPhoneInputProps = {
  onChange: (phone: string) => void;
  value: string;
};

type Selection = {
  country?: string;
  code?: string;
};

let loadedCountries: ICountry[] = [];

export const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({ onChange, value }) => {
  const [selection, setSelection] = useState<Selection>({ code: '+375', country: 'BY' });
  const [countries, setCountries] = useState<ICountry[]>([]);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(`${selection.code}${e.target.value}`);
    },
    [onChange, selection.code],
  );

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (!ref.current?.contains(evt.target as Node)) {
        setOpen(false);
        setCountries(loadedCountries);
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
      loadedCountries = await res.json();
      const countryCode = await getCountryByIp();
      setCountries(loadedCountries);
      const currentCountry = find(loadedCountries, { code: countryCode });
      setSelection({ code: currentCountry?.number, country: currentCountry?.code });
    };
    getCountries();
  }, []);

  const toggle = useCallback(() => {
    setOpen((opened) => !opened);
  }, []);

  const onSelect = useCallback((e: React.SyntheticEvent<HTMLLIElement>) => {
    setSelection({
      code: (e.target as HTMLLIElement).dataset.code,
      country: (e.target as HTMLLIElement).dataset.country,
    });
    setOpen(false);
    setCountries(loadedCountries);
    inputRef.current?.focus();
  }, []);

  const searchCountries = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setCountries(
      loadedCountries.filter((country) =>
        country.title.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  }, []);

  return (
    <div className={BLOCK_NAME} ref={ref}>
      <div className={`${BLOCK_NAME}__input-container`}>
        <button className={`${BLOCK_NAME}__code-btn`} onClick={toggle} type="button">
          <img
            loading="lazy"
            className={`${BLOCK_NAME}__flag-icon`}
            src={`/assets/flags/${selection.country}.svg`}
            alt={selection.country}
          />
          <span className={`${BLOCK_NAME}__country-code`}>{selection.code}</span>
          <ArrowDown />
        </button>
        <span className={`${BLOCK_NAME}__separator`} />
        <input
          autoComplete="off"
          autoFocus
          className={`${BLOCK_NAME}__input`}
          placeholder={t('loginPage.mobile_phone')}
          type="tel"
          pattern="(\+?\d[- .]*){7,13}"
          ref={inputRef}
          onChange={onPhoneChange}
          value={removeCountryCodeFromPhoneNumber(selection.code, new AsYouType().input(value))}
        />
      </div>
      {open && (
        <div className={`${BLOCK_NAME}__list`}>
          <div className={`${BLOCK_NAME}__search`}>
            <SearchSvg className={`${BLOCK_NAME}__search__icon`} />
            <input
              placeholder={t('loginPage.search_country')}
              onChange={searchCountries}
              className={`${BLOCK_NAME}__search__input`}
            />
          </div>
          <ul className={`${BLOCK_NAME}__list__countries`}>
            {countries.map((item) => (
              <li
                data-code={item.number}
                data-country={item.code}
                onClick={onSelect}
                key={item.code}
                className={`${BLOCK_NAME}__list-item`}>
                <img
                  loading="lazy"
                  className={`${BLOCK_NAME}__flag-icon`}
                  src={`/assets/flags/${item.code}.svg`}
                  alt={item.title}
                />
                <span className={`${BLOCK_NAME}__list-item-code`}>{item.number}</span>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
