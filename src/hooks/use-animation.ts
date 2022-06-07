import { useCallback, useState } from 'react';

import classNames from 'classnames';

import { ANIMATION_DURATION } from '../common/constants';

export function useAnimation(BLOCK_NAME: string, close: () => void) {
  const [rootClass, setRootClass] = useState(BLOCK_NAME);
  const [closeInitiated, setCloseInitiated] = useState(false);

  const animatedClose = useCallback(() => {
    setCloseInitiated(true);

    setRootClass(classNames(BLOCK_NAME, `${BLOCK_NAME}--close`));

    setTimeout(() => {
      setRootClass(BLOCK_NAME);
      close();
    }, ANIMATION_DURATION);
  }, [BLOCK_NAME, close]);

  return { rootClass, closeInitiated, animatedClose };
}
