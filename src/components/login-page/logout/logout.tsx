import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import { logoutAction } from '@store/auth/actions';
import React, { useEffect } from 'react';

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
