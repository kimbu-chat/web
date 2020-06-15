import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { countryList, countryInterface } from '../../../utils/countries';
import './CountrySelect.scss';

interface IAppProps {
  country: countryInterface | null;
  setCountry: Function;
  setPhone: Function;
}

function countryToFlag(isoCode: string): string {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export default function CountrySelect({ country, setCountry, setPhone }: IAppProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleCountryChange = (event: any, newCountry: countryInterface | null) => {
    setCountry((oldCountry: countryInterface) => {
      setPhone((oldPhone: string) => {
        if (oldCountry?.title.length > 0) {
          return newCountry?.number + oldPhone.split(' ').join('').split(oldCountry.number)[1];
        } else {
          return newCountry?.number;
        }
      });
      return newCountry;
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
