import { CubeLoader } from 'app/containers/cube-loader/cube-loader';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { AuthActions } from 'app/store/auth/actions';
import React, { useEffect } from 'react';

const Logout: React.FC = () => {
  const logout = useActionWithDispatch(AuthActions.logout);

  useEffect(() => {
    logout();
  }, []);

  return <CubeLoader />;
};

export default Logout;
