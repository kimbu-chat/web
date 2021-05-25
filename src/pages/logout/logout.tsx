import React, { useEffect } from 'react';

import { CubeLoader } from '@components/cube-loader';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { logoutAction } from '@store/auth/actions';

const Logout: React.FC = () => {
  const logout = useEmptyActionWithDeferred(logoutAction);
  useEffect(() => {
    logout().then(() => {
      window.location.replace('login');
    });
  }, [logout]);

  return <CubeLoader />;
};

export default Logout;
