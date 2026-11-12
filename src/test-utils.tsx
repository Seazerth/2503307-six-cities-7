import type {ReactElement} from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {render} from '@testing-library/react';
import type {RenderOptions} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import api from './services/api';
import type {Offer} from './types/offer';
import type {Review} from './types/review';
import reducer from './store/reducer';

export const testOffer: Offer = {
  id: 'offer-1',
  city: 'Paris',
  cityLocation: {latitude: 48.85661, longitude: 2.351499, zoom: 12},
  location: {latitude: 48.85661, longitude: 2.351499, zoom: 10},
  image: '/img/room.jpg',
  images: ['/img/room.jpg'],
  price: 120,
  title: 'Quiet apartment',
  type: 'apartment',
  rating: 4.5,
  isPremium: true,
  isFavorite: false,
};

export const testReview: Review = {
  id: 'review-1',
  date: '2024-01-01T00:00:00.000Z',
  user: {name: 'Alex', avatarUrl: '/img/avatar.jpg', isPro: false},
  comment: 'A pleasant stay.',
  rating: 5,
};

export const createTestStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {extraArgument: api},
  }),
});

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  store?: ReturnType<typeof createTestStore>;
};

export function renderWithProviders(
  ui: ReactElement,
  {route = '/', store = createTestStore(), ...renderOptions}: TestRenderOptions = {}
) {
  return {
    store,
    ...render(ui, {
      ...renderOptions,
      wrapper: ({children}) => (
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </Provider>
      ),
    }),
  };
}
