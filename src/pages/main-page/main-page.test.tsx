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

    expect(screen.getByText('1 places to stay in Paris')).toBeInTheDocument();
    await user.click(screen.getByRole('link', {name: 'Amsterdam'}));

    expect(await screen.findByText('1 places to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Amsterdam apartment'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: testOffer.title})).not.toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
