import {screen} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import {Route, Routes} from 'react-router-dom';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ApiOffer} from '../../types/offer';
import api from '../../services/api';
import {renderWithProviders, testOffer, testReview} from '../../test-utils';
import OfferPage from './offer-page';

vi.mock('../../components/map/map', () => ({default: () => <div data-testid="map" />}));

const apiOffer: ApiOffer = {
  id: testOffer.id,
  city: {name: testOffer.city, location: testOffer.cityLocation},
  location: testOffer.location,
  previewImage: testOffer.image,
  images: testOffer.images,
  price: testOffer.price,
  title: testOffer.title,
  type: testOffer.type,
  rating: testOffer.rating,
  bedrooms: 2,
  maxAdults: 3,
  description: 'A comfortable apartment in the city center.',
  goods: ['Wi-Fi', 'Kitchen'],
  host: {name: 'Alex', avatarUrl: '/img/avatar.jpg', isPro: true},
  isPremium: testOffer.isPremium,
  isFavorite: false,
};

describe('OfferPage', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('renders offer details, reviews, nearby places and a map', async () => {
    const nearbyOffer = {...apiOffer, id: 'nearby-offer', title: 'Nearby room'};
    mockApi
      .onGet(`/offers/${testOffer.id}`).reply(200, apiOffer)
      .onGet(`/offers/${testOffer.id}/nearby`).reply(200, [nearbyOffer])
      .onGet(`/comments/${testOffer.id}`).reply(200, [testReview]);
    renderWithProviders(
      <Routes>
        <Route path="/offer/:id" element={<OfferPage />} />
      </Routes>,
      {route: `/offer/${testOffer.id}`}
    );

    expect(await screen.findByRole('heading', {name: testOffer.title})).toBeInTheDocument();
    expect(screen.getByText('A comfortable apartment in the city center.')).toBeInTheDocument();
    expect(screen.getAllByText('Alex')).toHaveLength(2);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText(testReview.comment)).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Other places in the neighbourhood/})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Nearby room'})).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
