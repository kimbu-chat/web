import React, { useMemo } from 'react';
import './base-btn.scss';

export namespace BaseBtnNS {
	export interface Props
		extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
		width: 'contained' | 'auto';
		color: 'primary' | 'secondary' | 'default';
		variant: 'contained' | 'outlined';
		isLoading?: boolean;
		children: string;
		icon?: JSX.Element;
	}
}

const BaseBtn: React.FC<BaseBtnNS.Props> = ({
	width,
	color,
	disabled,
	variant,
	icon,
	children,
	className,
	isLoading,
	...props
}) => {
	const style = useMemo(() => {
		const btnColor: string = color === 'primary' ? '#3F8AE0' : color === 'secondary' ? '#D12433' : '#D7D8D9';
		const bluredBtnColor: string =
			color === 'primary'
				? 'rgba(63, 138, 224,0.7)'
				: color === 'secondary'
				? 'rgba(209, 36, 51,0.7)'
				: 'rgba(215, 216, 217,0.7)';

		return {
			width: width === 'contained' ? '100%' : 'auto',
			border: variant === 'outlined' ? `1px solid ${disabled ? bluredBtnColor : btnColor}` : 'none',
			backgroundColor: variant === 'contained' ? (disabled ? bluredBtnColor : btnColor) : 'transparent',
			color: variant === 'contained' ? '#fff' : disabled ? bluredBtnColor : btnColor,
		};
	}, [width, color, disabled, variant]);

	return (
		<button
			{...props}
			disabled={disabled}
			className={`base-btn ${className ? className : ''}`}
			style={{ ...style, ...props.style }}
		>
			<span className='base-btn__icon'>{icon}</span>
			{isLoading && <span className='base-btn__loader'>{icon}</span>}
			<span className='base-btn__text'>{children}</span>
		</button>
	);
};

export default BaseBtn;
