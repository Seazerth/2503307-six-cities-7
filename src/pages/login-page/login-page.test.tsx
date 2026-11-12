import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Route, Routes, useLocation} from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import api, {TOKEN_KEY} from '../../services/api';
import {AuthorizationStatus} from '../../store/authorization-status';
import {setAuthorizationStatus} from '../../store/action';
import {createTestStore, renderWithProviders} from '../../test-utils';
import LoginPage from './login-page';

function CurrentPath() {
  const location = useLocation();
  return <p>Current location: {location.pathname}{location.search}</p>;
}

describe('LoginPage', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  afterEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  it('renders the login fields and links to a randomly selected city', () => {
    renderWithProviders(
      <>
        <LoginPage />
        <CurrentPath />
      </>
    );

    expect(screen.getByRole('heading', {name: 'Sign in'})).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeRequired();
    expect(screen.getByLabelText('Password')).toHaveAttribute('pattern', '(?=.*[A-Za-z])(?=.*[0-9]).+');
    expect(screen.getByRole('link', {name: /Paris|Cologne|Brussels|Amsterdam|Hamburg|Dusseldorf/})).toBeInTheDocument();
  });

  it('navigates to the city selected from the login screen', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LoginPage />
        <CurrentPath />
      </>
    );

    const cityLink = screen.getByRole('link', {name: /Paris|Cologne|Brussels|Amsterdam|Hamburg|Dusseldorf/});
    const city = cityLink.textContent;
    await user.click(cityLink);

    expect(screen.getByText(`Current location: /?city=${encodeURIComponent(city ?? '')}`)).toBeInTheDocument();
  });

  it('submits credentials and redirects to the main page after successful login', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    mockApi.onPost('/login', {email: 'guest@example.com', password: 'pass123'}).reply(200, {
      email: 'guest@example.com',
      token: 'test-token',
    });
    mockApi.onGet('/favorite').reply(200, []);
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<><LoginPage /><CurrentPath /></>} />
        <Route path="/" element={<CurrentPath />} />
      </Routes>,
      {route: '/login', store}
    );

    await user.type(screen.getByLabelText('E-mail'), 'guest@example.com');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByRole('button', {name: 'Sign in'}));

    expect(await screen.findByText('Current location: /')).toBeInTheDocument();
    expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(localStorage.getItem(TOKEN_KEY)).toBe('test-token');
  });

  it('redirects an authenticated user away from the login page', () => {
    const store = createTestStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<><LoginPage /><CurrentPath /></>} />
        <Route path="/" element={<CurrentPath />} />
      </Routes>,
      {route: '/login', store}
    );

    expect(screen.getByText('Current location: /')).toBeInTheDocument();
  });
});
