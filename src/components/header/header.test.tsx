import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import api, {TOKEN_KEY} from '../../services/api';
import {AuthorizationStatus} from '../../store/authorization-status';
import {loadFavoriteOffers, setAuthorizationStatus, setUserEmail} from '../../store/action';
import {createTestStore, renderWithProviders, testOffer} from '../../test-utils';
import Header from './header';

describe('Header', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  afterEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  it('renders the logo and sign-in link for a guest', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('link', {name: '6 cities logo'})).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
  });

  it('renders the authenticated profile and favorite count', () => {
    const store = createTestStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    store.dispatch(setUserEmail('guest@example.com'));
    store.dispatch(loadFavoriteOffers([{...testOffer, isFavorite: true}]));
    renderWithProviders(<Header />, {store});

    expect(screen.getByRole('link', {name: /guest@example.com/})).toHaveAttribute('href', '/favorites');
    expect(screen.getByText('1')).toHaveClass('header__favorite-count');
    expect(screen.getByRole('button', {name: 'Sign out'})).toBeInTheDocument();
  });

  it('logs out when the sign-out button is clicked', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    store.dispatch(setUserEmail('guest@example.com'));
    localStorage.setItem(TOKEN_KEY, 'test-token');
    mockApi.onDelete('/logout').reply(200);
    renderWithProviders(<Header />, {store});

    await user.click(screen.getByRole('button', {name: 'Sign out'}));

    await waitFor(() => {
      expect(screen.getByRole('link', {name: 'Sign in'})).toBeInTheDocument();
    });
    expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
