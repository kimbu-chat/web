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

enum BtnColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DEFAULT = 'default',
}

enum BluredBtnColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DEFAULT = 'default',
}

enum Variant {
  CONTAINED = 'contained',
  OUTLINED = 'outlined',
}

const btnColorMap = {
  [BtnColor.DEFAULT]: 'var(--kingBlueLight-transparent)',
  [BtnColor.PRIMARY]: 'var(--dt-kingBlue-wt-kingBlueLight)',
  [BtnColor.SECONDARY]: 'var(--red)',
};

const blurredBtnColorMap = {
  [BluredBtnColor.DEFAULT]: 'rgba(215, 216, 217,0.7)',
  [BluredBtnColor.PRIMARY]: 'rgba(63, 138, 224,0.7)',
  [BluredBtnColor.SECONDARY]: 'rgba(209, 36, 51,0.7)',
};

const BaseBtn: React.FC<IBaseBtnProps> = React.memo(
  ({ width, color, disabled, variant, icon, children, className, isLoading, ...props }) => {
    const style = useMemo(() => {
      const btnColor = btnColorMap[color];
      const bluredBtnColor = blurredBtnColorMap[color];

      const variantMap = {
        [Variant.CONTAINED]: {
          border: 'none',
          backgroundColor: disabled ? bluredBtnColor : btnColor,
          color: '#fff',
        },
        [Variant.OUTLINED]: {
          border: `1px solid ${disabled ? bluredBtnColor : btnColor}`,
          backgroundColor: 'transparent',
          color: disabled ? bluredBtnColor : btnColor,
        },
      };

      return {
        width: width === 'contained' ? '100%' : 'auto',
        ...variantMap[variant],
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
