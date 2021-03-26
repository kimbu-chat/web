import { useEffect, useState } from 'react';

export const useForceUpdate = (interval: number) => {
  const [, setValue] = useState(0); // integer state

  useEffect(() => {
    const timer = setInterval(() => setValue((value) => value + 1), interval);

    return () => clearInterval(timer);
  }, [interval]);
};
