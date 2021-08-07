import React, { FC, useCallback, useMemo, useState, memo, useEffect, useRef } from 'react';

import debounce from 'lodash/debounce';

import './ripple.scss';

const ANIMATION_DURATION_MS = 700;

const BLOCK_NAME = 'ripple-container';

const RippleEffect: FC = () => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const unmounted = useRef(false);

  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

  const cleanUpDebounced = useMemo(
    () =>
      debounce(() => {
        if (!unmounted.current) {
          setRipples([]);
        }
      }, ANIMATION_DURATION_MS),
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button !== 0) {
        return;
      }

      const container = e.currentTarget as HTMLDivElement;
      const position = container.getBoundingClientRect() as DOMRect;

      const rippleSize = container.offsetWidth / 2;

      setRipples([
        ...ripples,
        {
          id: ripples.length,
          x: e.clientX - position.x - rippleSize / 2,
          y: e.clientY - position.y - rippleSize / 2,
          size: rippleSize,
        },
      ]);

      requestAnimationFrame(() => {
        cleanUpDebounced();
      });
    },
    [ripples, cleanUpDebounced],
  );

  return (
    <div className={BLOCK_NAME} onMouseDown={handleMouseDown}>
      {ripples.map(({ id, x, y, size }) => (
        <span key={id} style={{ left: x, top: y, width: size, height: size }} />
      ))}
    </div>
  );
};

export default memo(RippleEffect);
