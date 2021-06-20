import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import classnames from 'classnames';

import './tooltip-popover.scss';

const BLOCK_NAME = 'tooltip-popover';
const TIME_TO_UPDATE = 100;

type TooltipPopoverProps = {
  tooltipRef: any;
  className?: string;
};

export const TooltipPopover: React.FC<React.PropsWithChildren<TooltipPopoverProps>> = ({
  children,
  tooltipRef,
  className,
}) => {
  const getCoords = useCallback(() => {
    const rect = tooltipRef?.current.getBoundingClientRect();
    return {
      left: rect.x,
      top: rect.bottom + window.scrollY + 7,
    };
  }, [tooltipRef]);

  const [coords, setCoords] = useState(getCoords());

  const updateTooltipCoords = useCallback(() => {
    setCoords(getCoords());
  }, [getCoords]);

  const updateCoords = debounce(updateTooltipCoords, TIME_TO_UPDATE);

  useEffect(() => {
    window.addEventListener('resize', updateCoords);
    return () => {
      window.removeEventListener('resize', updateCoords);
    };
  }, [updateCoords, updateTooltipCoords]);

  return (
    <div style={{ ...coords }} className={classnames(BLOCK_NAME, className)}>
      {children}
    </div>
  );
};
