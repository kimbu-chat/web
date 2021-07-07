import React from 'react';

import { ReactComponent as SearchSvg } from '@icons/search.svg';

import './search-box.scss';

interface ISearchBoxProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
}

export const SearchBox: React.FC<ISearchBoxProps> = ({
  onChange,
  iconClassName = '',
  inputClassName = '',
  containerClassName = '',
}) => (
  <div className={`search-box__input-wrapper ${containerClassName}`}>
    <input
      onChange={onChange}
      placeholder="Search"
      type="text"
      className={`search-box__input ${inputClassName}`}
    />
    <SearchSvg viewBox="0 0 24 24" className={`search-box__input__svg ${iconClassName}`} />
  </div>
);
