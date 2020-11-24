import React from 'react';
import './search-box.scss';
import SearchSvg from 'icons/ic-search.svg';

namespace SearchBox {
	export interface Props {
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	}
}

const SearchBox = ({ onChange }: SearchBox.Props) => {
	return (
		<div className={`search-box__input-wrapper `}>
			<input onChange={onChange} placeholder='   ' type='text' className='search-box__input' />
			<div className='search-box__input__placeholder'>
				<SearchSvg className={'search-box__input__svg'} viewBox='0 0 25 25' />
				<span>Search</span>
			</div>
		</div>
	);
};

export default SearchBox;
