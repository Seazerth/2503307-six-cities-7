import {createSelector} from '@reduxjs/toolkit';
import type {AppState} from './reducer';

export const selectCity = (state: AppState) => state.city;
export const selectOffers = (state: AppState) => state.offers;

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city)
);

export const selectFavoriteOffers = createSelector(
  [selectOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);
