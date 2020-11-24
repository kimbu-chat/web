import React from 'react';
import './check-box.scss';

import CheckBoxSvg from 'icons/ic-checkbox.svg';

namespace CheckBox {
	export interface Props {
		nestingLevel: number;
		onClick: () => void;
		isChecked: boolean;
		title: string;
	}
}

const CheckBox = ({ isChecked, title, onClick, nestingLevel }: CheckBox.Props) => {
	return (
		<div style={{ marginLeft: nestingLevel * 30 + 'px' }} onClick={onClick} className='check-box'>
			<div className='check-box__check-box'>{isChecked && <CheckBoxSvg />}</div>
			<span className='check-box__title'>{title}</span>
		</div>
	);
};

export default CheckBox;
