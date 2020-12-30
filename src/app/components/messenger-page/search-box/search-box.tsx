import React from 'react';
import './search-box.scss';
import SearchSvg from 'icons/ic-search.svg';

namespace SearchBoxNS {
  export interface IProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
}

export const SearchBox = React.memo(({ onChange }: SearchBoxNS.IProps) => (
  <div className='search-box__input-wrapper '>
    <input onChange={onChange} placeholder='   ' type='text' className='search-box__input' />
    <div className='search-box__input__placeholder'>
      <SearchSvg className='search-box__input__svg' viewBox='0 0 25 25' />
      <span>Search</span>
    </div>
  </div>
));
