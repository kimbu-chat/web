import React, { useMemo } from 'react';
import './base-btn.scss';

export interface IBaseBtnProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  width: 'contained' | 'auto';
  color: 'primary' | 'secondary' | 'default';
  variant: 'contained' | 'outlined';
  isLoading?: boolean;
  children: string;
  icon?: JSX.Element;
}

const BaseBtn: React.FC<IBaseBtnProps> = React.memo(
  ({ width, color, disabled, variant, icon, children, className, isLoading, ...props }) => {
    const style = useMemo(() => {
      const btnColor: string =
        color === 'primary'
          ? 'var(--dt-kingBlue-wt-kingBlueLight)'
          : color === 'secondary'
          ? 'var(--red)'
          : 'var(--dt-kingBlue-wt-kingBlueLight-transparent)';
      const bluredBtnColor: string =
        color === 'primary'
          ? 'rgba(63, 138, 224,0.7)'
          : color === 'secondary'
          ? 'rgba(209, 36, 51,0.7)'
          : 'rgba(215, 216, 217,0.7)';

      return {
        width: width === 'contained' ? '100%' : 'auto',
        border:
          variant === 'outlined' ? `1px solid ${disabled ? bluredBtnColor : btnColor}` : 'none',
        backgroundColor:
          variant === 'contained' ? (disabled ? bluredBtnColor : btnColor) : 'transparent',
        color: variant === 'contained' ? '#fff' : disabled ? bluredBtnColor : btnColor,
      };
    }, [width, color, disabled, variant]);

    return (
      <button
        type="button"
        {...props}
        disabled={disabled}
        className={`base-btn ${className || ''}`}
        style={{ ...style, ...props.style }}>
        <span className="base-btn__icon">{icon}</span>
        {isLoading && <span className="base-btn__loader">{icon}</span>}
        <span className="base-btn__text">{children}</span>
      </button>
    );
  },
);

BaseBtn.displayName = 'BaseBtn';

export { BaseBtn };
