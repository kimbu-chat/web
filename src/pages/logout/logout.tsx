import React, { useEffect } from 'react';

import { CubeLoader } from '@components/cube-loader';
import { logoutAction } from '@store/auth/actions';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

export const Logout = () => {
  const logout = useActionWithDispatch(logoutAction);

  useEffect(() => {
    logout();
  }, [logout]);

  return <CubeLoader />;
};
