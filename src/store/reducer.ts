import {createReducer} from '@reduxjs/toolkit';
import {changeCity, loadOffers, setOffersDataLoading, setOffersLoadingError} from './action';
import type {Offer} from '../types/offer';

export type AppState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  offersLoadingError: string | null;
};

const initialState: AppState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
  offersLoadingError: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
  builder
    .addCase(setOffersDataLoading, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(setOffersLoadingError, (state, action) => {
      state.offersLoadingError = action.payload;
    });
});

export default reducer;
