import React, { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';

import { AsYouType } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';

import { useCountry } from '@hooks/use-country';
import { ReactComponent as ArrowDown } from '@icons/arrow-down.svg';
import { ReactComponent as SearchSvg } from '@icons/search.svg';
import { removeCountryCodeFromPhoneNumber } from '@utils/phone-number-utils';

import type { ICountry } from '@common/country';

import './country-phone-input.scss';

const BLOCK_NAME = 'country-phone-input';

type CountryPhoneInputProps = {
  onChange: (phone: string) => void;
  value: string;
};

export const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({ onChange, value }) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<ICountry[]>([]);

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { countries: loadedCountries, country, setCountry } = useCountry();

  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(`${country.number}${e.target.value}`);
    },
    [onChange, country.number],
  );

  useEffect(() => {
    setCountries(loadedCountries);
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
  }, [loadedCountries, ref]);

  const toggle = useCallback(() => {
    setOpen((opened) => !opened);
  }, []);

  const onSelect = useCallback(
    (e: React.SyntheticEvent<HTMLLIElement>) => {
      const newCountry = loadedCountries.find(
        (currentCountry) => currentCountry.code === (e.target as HTMLLIElement).dataset.code,
      );
      if (newCountry) {
        setCountry(newCountry);
        setOpen(false);
        setCountries(loadedCountries);
        inputRef.current?.focus();
      }
    },
    [loadedCountries, setCountry],
  );

  const searchCountries = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;
      setCountries(
        loadedCountries.filter((currentCountry) =>
          currentCountry.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    },
    [loadedCountries],
  );

  return (
    <div className={BLOCK_NAME} ref={ref}>
      <div className={`${BLOCK_NAME}__input-container`}>
        <button className={`${BLOCK_NAME}__code-btn`} onClick={toggle} type="button">
          <img
            loading="lazy"
            className={`${BLOCK_NAME}__flag-icon`}
            src={`/assets/flags/${country.code}.svg`}
            alt={country.code}
          />
          <span className={`${BLOCK_NAME}__country-code`}>{country.number}</span>
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
          value={removeCountryCodeFromPhoneNumber(country.number, new AsYouType().input(value))}
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
                data-code={item.code}
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
