import React, { useEffect } from 'react';

import { CubeLoader } from '@components/cube-loader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { logoutAction } from '@store/auth/actions';

export const Logout = () => {
  const logout = useActionWithDispatch(logoutAction);

  useEffect(() => {
    logout();
  }, [logout]);

  return <CubeLoader />;
};
