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
  images: Array.from({length: 7}, (_, index) => `/img/offer-${index}.jpg`),
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
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(document.querySelectorAll('.offer__gallery .offer__image')).toHaveLength(6);
    expect(screen.getAllByText('Alex')).toHaveLength(2);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText(testReview.comment)).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Other places in the neighbourhood/})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Nearby room'})).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('uses singular labels for one bedroom and one guest', async () => {
    const singleOccupancyOffer = {...apiOffer, bedrooms: 1, maxAdults: 1, type: 'room'};
    mockApi
      .onGet(`/offers/${testOffer.id}`).reply(200, singleOccupancyOffer)
      .onGet(`/offers/${testOffer.id}/nearby`).reply(200, [])
      .onGet(`/comments/${testOffer.id}`).reply(200, []);
    renderWithProviders(
      <Routes>
        <Route path="/offer/:id" element={<OfferPage />} />
      </Routes>,
      {route: `/offer/${testOffer.id}`}
    );

    expect(await screen.findByText('Room')).toBeInTheDocument();
    expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
  });

  it('shows the ten newest reviews and keeps the total review count', async () => {
    const reviews = Array.from({length: 12}, (_, index) => ({
      ...testReview,
      id: `review-${index}`,
      date: new Date(Date.UTC(2024, 0, index + 1)).toISOString(),
      comment: `Review ${index}`,
    }));
    mockApi
      .onGet(`/offers/${testOffer.id}`).reply(200, apiOffer)
      .onGet(`/offers/${testOffer.id}/nearby`).reply(200, [])
      .onGet(`/comments/${testOffer.id}`).reply(200, reviews);
    const {container} = renderWithProviders(
      <Routes>
        <Route path="/offer/:id" element={<OfferPage />} />
      </Routes>,
      {route: `/offer/${testOffer.id}`}
    );

    expect(await screen.findByText('Review 11')).toBeInTheDocument();
    expect(screen.getByText('12', {selector: '.reviews__amount'})).toBeInTheDocument();
    expect(container.querySelectorAll('.reviews__item')).toHaveLength(10);
    expect(container.querySelector('.reviews__item .reviews__text')).toHaveTextContent('Review 11');
    expect(screen.queryByText('Review 1', {exact: true})).not.toBeInTheDocument();
  });
});
