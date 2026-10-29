import {createReducer} from '@reduxjs/toolkit';
import {
  changeCity,
  loadOffers,
  setAuthorizationError,
  setAuthorizationStatus,
  setOffersDataLoading,
  setOffersLoadingError,
  setUserEmail
} from './action';
import type {Offer} from '../types/offer';
import {AuthorizationStatus} from './authorization-status';

export type AppState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  offersLoadingError: string | null;
  authorizationStatus: AuthorizationStatus;
  userEmail: string | null;
  authorizationError: string | null;
};

const initialState: AppState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
  offersLoadingError: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  userEmail: null,
  authorizationError: null,
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
    })
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserEmail, (state, action) => {
      state.userEmail = action.payload;
    })
    .addCase(setAuthorizationError, (state, action) => {
      state.authorizationError = action.payload;
    });
});

export default reducer;
