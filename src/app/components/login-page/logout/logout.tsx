import { CubeLoader } from 'app/containers/cube-loader/cube-loader';
import { useEmptyActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { AuthActions } from 'app/store/auth/actions';
import React, { useEffect } from 'react';

const Logout: React.FC = () => {
  const logout = useEmptyActionWithDeferred(AuthActions.logout);

  useEffect(() => {
    logout().then(() => {
      window.location.replace('login');
    });
  }, []);

  return <CubeLoader />;
};

export default Logout;
