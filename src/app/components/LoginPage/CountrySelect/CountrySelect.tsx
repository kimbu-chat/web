import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { countryList, countryInterface } from '../../../utils/countries';
import './CountrySelect.scss';

namespace CountrySelect {
  export interface Props {
    country: countryInterface | null;
    setCountry: (setNewCountry: (oldCountry: countryInterface | null) => countryInterface | null) => void;
    setPhone: (setNewPhone: ((oldPhone: string) => string) | string) => void;
  }
}

function countryToFlag(isoCode: string): string {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export default function CountrySelect({ country, setCountry, setPhone }: CountrySelect.Props) {
  const [inputValue, setInputValue] = React.useState('');

  const handleCountryChange = (event: any, newCountry: countryInterface | null) => {
    setCountry((oldCountry) => {
      setPhone((oldPhone) => {
        if (typeof oldCountry === 'object') {
          const onlyNumber = oldPhone
            .split(' ')
            .join('')
            .split(oldCountry ? oldCountry.number : '')[1];
          const preparedNumber = newCountry?.number + onlyNumber ? onlyNumber : '';
          const newCode = newCountry ? newCountry.number : '';
          return preparedNumber ? preparedNumber : newCode;
        } else {
          return newCountry ? newCountry.number : '';
        }
      });
      return newCountry ? newCountry : countryList[0];
    });
  };

  return (
    <Autocomplete
      value={country}
      className="country-select"
      onChange={(event, newCountry) => handleCountryChange(event, newCountry)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={countryList}
      getOptionLabel={(option) => option.title}
      renderOption={(option) => (
        <div className="country-select__country">
          <span className="country-select__flag">{countryToFlag(option.code)}</span>
          {option.title} <span className="country-select__number">{option.number}</span>
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Country"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
      filterOptions={createFilterOptions({
        stringify: (option) => option.title + option.number
      })}
    />
  );
}
