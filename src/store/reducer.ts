import {createReducer} from '@reduxjs/toolkit';
import {changeCity, loadOffers} from './action';
import type {Offer} from '../mocks/offers';

export type AppState = {
  city: string;
  offers: Offer[];
};

const initialState: AppState = {
  city: 'Paris',
  offers: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
});

export default reducer;
