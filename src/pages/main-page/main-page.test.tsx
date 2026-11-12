import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {loadOffers} from '../../store/action';
import {createTestStore, renderWithProviders, testOffer} from '../../test-utils';
import MainPage from './main-page';

vi.mock('../../components/map/map', () => ({default: () => <div data-testid="map" />}));

describe('MainPage', () => {
  it('shows the empty state when there are no offers for the selected city', () => {
    renderWithProviders(<MainPage />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/in Paris/)).toBeInTheDocument();
  });

  it('updates the city and offer list when a city tab is selected', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(loadOffers([
      testOffer,
      {...testOffer, id: 'offer-2', city: 'Amsterdam', title: 'Amsterdam apartment'},
    ]));
    renderWithProviders(<MainPage />, {store});

    expect(screen.getByText('1 place to stay in Paris')).toBeInTheDocument();
    await user.click(screen.getByRole('link', {name: 'Amsterdam'}));

    expect(await screen.findByText('1 place to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Amsterdam apartment'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: testOffer.title})).not.toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('initializes the selected city from the URL', () => {
    const store = createTestStore();
    store.dispatch(loadOffers([
      testOffer,
      {...testOffer, id: 'offer-2', city: 'Amsterdam', title: 'Amsterdam apartment'},
    ]));
    renderWithProviders(<MainPage />, {route: '/?city=Amsterdam', store});

    expect(screen.getByRole('link', {name: 'Amsterdam'})).toHaveClass('tabs__item--active');
    expect(screen.getByText('1 place to stay in Amsterdam')).toBeInTheDocument();
  });

  it('sorts the selected city offers by price', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(loadOffers([
      {...testOffer, title: 'Mid-priced apartment', price: 120},
      {...testOffer, id: 'offer-2', title: 'Expensive apartment', price: 200},
      {...testOffer, id: 'offer-3', title: 'Affordable apartment', price: 80},
    ]));
    renderWithProviders(<MainPage />, {store});

    await user.click(screen.getByRole('button', {name: 'Popular'}));
    await user.click(screen.getByRole('option', {name: 'Price: low to high'}));

    expect(screen.getAllByRole('article').map((card) => card.querySelector('h2')?.textContent)).toEqual([
      'Affordable apartment',
      'Mid-priced apartment',
      'Expensive apartment',
    ]);
  });
});
