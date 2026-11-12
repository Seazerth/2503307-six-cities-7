import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {describe, expect, it, vi} from 'vitest';
import {createTestStore} from '../../test-utils';
import {AuthorizationStatus} from '../../store/authorization-status';
import {setAuthorizationStatus} from '../../store/action';
import App from './app';

vi.mock('../../pages/main-page/main-page', () => ({default: () => <h1>Main route</h1>}));
vi.mock('../../pages/login-page/login-page', () => ({default: () => <h1>Login route</h1>}));
vi.mock('../../pages/favorites-page/favorites-page', () => ({default: () => <h1>Favorites route</h1>}));
vi.mock('../../pages/offer-page/offer-page', () => ({default: () => <h1>Offer route</h1>}));
vi.mock('../../pages/not-found-page/not-found-page', () => ({default: () => <h1>Not found route</h1>}));

function renderAtPath(path: string, authorizationStatus = AuthorizationStatus.NoAuth) {
  window.history.replaceState({}, '', path);
  const store = createTestStore();
  store.dispatch(setAuthorizationStatus(authorizationStatus));

  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

describe('App routing', () => {
  it.each([
    ['/', 'Main route'],
    ['/login', 'Login route'],
    ['/offer/offer-1', 'Offer route'],
    ['/unknown', 'Not found route'],
  ])('renders the correct page for %s', (path, heading) => {
    renderAtPath(path);

    expect(screen.getByRole('heading', {name: heading})).toBeInTheDocument();
  });

  it('renders favorites for an authorized user', () => {
    renderAtPath('/favorites', AuthorizationStatus.Auth);

    expect(screen.getByRole('heading', {name: 'Favorites route'})).toBeInTheDocument();
  });

  it('redirects a guest from favorites to login', () => {
    renderAtPath('/favorites', AuthorizationStatus.NoAuth);

    expect(screen.getByRole('heading', {name: 'Login route'})).toBeInTheDocument();
  });

  it.each([
    ['/', AuthorizationStatus.NoAuth, 'page--main'],
    ['/login', AuthorizationStatus.NoAuth, 'page--login'],
    ['/favorites', AuthorizationStatus.Auth, 'page--favorites-empty'],
    ['/offer/offer-1', AuthorizationStatus.NoAuth, 'page'],
    ['/unknown', AuthorizationStatus.NoAuth, 'page'],
  ] as const)('renders the shared header inside the page shell for %s', (path, status, pageClass) => {
    const {container} = renderAtPath(path, status);
    const page = container.querySelector('.page');

    expect(page).toHaveClass(pageClass);
    expect(page?.querySelector('.header')).toBeInTheDocument();
  });
});
