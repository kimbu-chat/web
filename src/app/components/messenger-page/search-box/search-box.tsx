import React from 'react';
import './search-box.scss';
import SearchSvg from 'icons/ic-search.svg';

interface ISearchBoxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBox: React.FC<ISearchBoxProps> = React.memo(({ onChange, ...props }) => (
  <div className='search-box__input-wrapper '>
    <input onChange={onChange} placeholder='   ' type='text' className='search-box__input' {...props} />
    <div className='search-box__input__placeholder'>
      <SearchSvg className='search-box__input__svg' viewBox='0 0 25 25' />
      <span>Search</span>
    </div>
  </div>
));
