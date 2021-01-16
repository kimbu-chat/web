import React from 'react';
import './search-box.scss';
import SearchSvg from 'icons/search.svg';

interface ISearchBoxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBox: React.FC<ISearchBoxProps> = React.memo(({ onChange, ...props }) => (
  <div className='search-box__input-wrapper '>
    <SearchSvg className='search-box__input__svg' />
    <input onChange={onChange} placeholder='Search' type='text' className='search-box__input' {...props} />
  </div>
));
