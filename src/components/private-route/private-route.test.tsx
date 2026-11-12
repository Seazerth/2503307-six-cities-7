import {screen} from '@testing-library/react';
import {Route, Routes} from 'react-router-dom';
import {describe, expect, it} from 'vitest';
import {AuthorizationStatus} from '../../store/authorization-status';
import {setAuthorizationStatus} from '../../store/action';
import {createTestStore, renderWithProviders} from '../../test-utils';
import PrivateRoute from './private-route';

function renderPrivateRoute(status: AuthorizationStatus) {
  const store = createTestStore();
  store.dispatch(setAuthorizationStatus(status));
  return renderWithProviders(
    <Routes>
      <Route path="/favorites" element={<PrivateRoute><h1>Favorites</h1></PrivateRoute>} />
      <Route path="/login" element={<h1>Login</h1>} />
    </Routes>,
    {route: '/favorites', store}
  );
}

describe('PrivateRoute', () => {
  it('shows a loading status while authorization is unknown', () => {
    renderPrivateRoute(AuthorizationStatus.Unknown);

    expect(screen.getByRole('status')).toHaveTextContent('Loading offers...');
  });

  it('renders the protected content for an authorized user', () => {
    renderPrivateRoute(AuthorizationStatus.Auth);

    expect(screen.getByRole('heading', {name: 'Favorites'})).toBeInTheDocument();
  });

  it('redirects an unauthorized user to login', () => {
    renderPrivateRoute(AuthorizationStatus.NoAuth);

    expect(screen.getByRole('heading', {name: 'Login'})).toBeInTheDocument();
  });
});
