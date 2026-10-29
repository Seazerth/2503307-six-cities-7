import {Navigate} from 'react-router-dom';
import type {ReactNode} from 'react';
import {useSelector} from 'react-redux';
import Spinner from '../spinner/spinner';
import type {RootState} from '../../store';
import {selectAuthorizationStatus} from '../../store/selectors';
import {AuthorizationStatus} from '../../store/authorization-status';

type PrivateRouteProps = {
  children: ReactNode;
};

function PrivateRoute({children}: PrivateRouteProps) {
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return authorizationStatus === AuthorizationStatus.Auth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
