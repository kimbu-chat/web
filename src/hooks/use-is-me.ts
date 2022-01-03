import { useSelector } from 'react-redux';

import { myIdSelector } from '@store/my-profile/selectors';

export function useIsMe(id?: number): boolean {
  const myId = useSelector(myIdSelector);

  return id === myId;
}
