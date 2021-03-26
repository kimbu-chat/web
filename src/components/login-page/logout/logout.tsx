import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { useEmptyActionWithDeferred } from '@hooks/use-action-with-deferred';
import * as AuthActions from '@store/auth/actions';
import React, { useEffect } from 'react';

const Logout: React.FC = () => {
  const logout = useEmptyActionWithDeferred(AuthActions.logout);

  useEffect(() => {
    logout().then(() => {
      window.location.replace('login');
    });
  }, [logout]);

  return <CubeLoader />;
};

export default Logout;
