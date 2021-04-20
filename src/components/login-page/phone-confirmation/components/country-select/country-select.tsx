import React, { useEffect } from 'react';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { useTranslation } from 'react-i18next';

import { ReactComponent as DownSvg } from '@icons/ic-chevron-down.svg';
import { countryList } from '@common/countries';
import { ICountry } from '@common/country';

interface ICountrySelectProps {
  country?: ICountry;
  handleCountryChange: (newCountry: ICountry) => void;
  setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
}

export const CountrySelect: React.FC<ICountrySelectProps> = React.memo(
  ({ country, handleCountryChange, setRef }) => {
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
      options: countryList,
      getOptionLabel: (option) => option.title,
      value: country,
      onChange: (_event, newCountry) => newCountry && handleCountryChange(newCountry),
      filterOptions: createFilterOptions({
        stringify: (option) => option.title + option.number,
      }),
    });

    const inputProps = getInputProps();

    useEffect(() => {
      setRef((inputProps as { ref: React.RefObject<HTMLInputElement> }).ref);
    }, [inputProps, setRef]);

    return (
      <div {...getRootProps()} className="country-select">
        <input
          placeholder={t('loginPage.country')}
          type="text"
          className="country-select__input"
          {...inputProps}
        />
        <DownSvg
          viewBox="0 0 25 25"
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
                    <span className="country-select__country-name">{option.title}</span>
                    <span className="country-select__number">{option.number}</span>
                  </div>
                ),
            )}
          </div>
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.country === nextProps.country,
);
