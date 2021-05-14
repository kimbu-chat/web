import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { ReactComponent as ArrowSvg } from '@icons/arrow-v.svg';
import { ICountry } from '@common/country';

import './country-select.scss';

interface ICountrySelectProps {
  country?: ICountry;
  countries?: ICountry[];
  handleCountryChange: (newCountry: ICountry | null) => void;
  setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
}

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  country,
  handleCountryChange,
  setRef,
  countries,
}) => {
  const { t } = useTranslation();

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    popupOpen,
  } = useAutocomplete({
    id: 'country-login-autocomplete',
    options: countries || [],
    getOptionLabel: (option) => option.title,
    value: country,
    onChange: (_event, newCountry) => handleCountryChange(newCountry),
    filterOptions: createFilterOptions({
      stringify: (option) => option.title + option.number,
    }),
    getOptionSelected: (option, value) => option.code === value.code,
  });

  const inputProps = getInputProps();

  useEffect(() => {
    setRef((inputProps as { ref: React.RefObject<HTMLInputElement> }).ref);
  }, [setRef, inputProps]);

  return (
    <div
      {...getRootProps()}
      className={`country-select ${popupOpen ? 'country-select--open' : ''}`}>
      <div className="country-select__label">{t('phoneInputGroup.country')}</div>
      <input
        placeholder={t('phoneInputGroup.country')}
        type="text"
        className="country-select__input"
        {...inputProps}
      />
      <ArrowSvg
        viewBox="0 0 8 14"
        className={`country-select__input-svg ${
          popupOpen ? 'country-select__input-svg--open' : ''
        }`}
      />
      {groupedOptions.length > 0 ? (
        <div className="country-select__countries" {...getListboxProps()}>
          {groupedOptions.map(
            (option, index) =>
              option.number && (
                <div className="country-select__country" {...getOptionProps({ option, index })}>
                  <span className="country-select__number">{option.number}</span>
                  <span className="country-select__country-name">{option.title}</span>
                </div>
              ),
          )}
        </div>
      ) : null}
    </div>
  );
};
