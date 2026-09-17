import {Navigate} from 'react-router-dom';
import type {ReactNode} from 'react';

type PrivateRouteProps = {
  isAuthorized: boolean;
  children: ReactNode;
};

function PrivateRoute({isAuthorized, children}: PrivateRouteProps) {
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
