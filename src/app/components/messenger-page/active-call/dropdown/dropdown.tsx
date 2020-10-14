import React, { useCallback, useRef, useState } from 'react';
import './dropdown.scss';
import DropDownSvg from 'app/assets/icons/ic-chevron-down.svg';
import useOnClickOutside from 'app/utils/hooks/useOnClickOutside';

namespace Dropdown {
	export interface Props {
		selectedString: string;
		disabled: boolean;
		options: {
			title: string;
			onClick: () => void;
		}[];
	}
}

const Dropdown = ({ selectedString, options, disabled }: Dropdown.Props) => {
	const [optionsOpened, setOptionsOpened] = useState(false);
	const changeOptionsOpenedStatus = useCallback(() => {
		setOptionsOpened((oldState) => !oldState);
	}, []);
	const closeOptionsOpenedStatus = useCallback(() => {
		setOptionsOpened(() => false);
		console.log('open');
	}, []);

	const dropdownRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(dropdownRef, closeOptionsOpenedStatus);

	return (
		<div ref={dropdownRef} className='dropdown__select-wrapper dropdown__select-wrapper--audio'>
			<div
				className={`dropdown__select ${disabled ? 'dropdown__select--disabled' : ''}`}
				onClick={disabled ? () => {} : changeOptionsOpenedStatus}
			>
				{selectedString}
				<DropDownSvg viewBox='0 0 25 25' />
			</div>
			{optionsOpened && (
				<div className='dropdown__select-block'>
					{options.map((option) => (
						<div className='dropdown__select-block__option' key={option.title} onClick={option.onClick}>
							{option.title}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
