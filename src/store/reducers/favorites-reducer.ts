import {createReducer} from '@reduxjs/toolkit';
import {
  clearFavorites,
  loadFavoriteOffers,
  setFavoriteError,
  setFavoritesError,
  setFavoritesLoading,
  updateFavoriteOffer,
} from '../action';
import type {Offer} from '../../types/offer';

export type FavoritesState = {
  favoriteOffers: Offer[];
  isFavoritesLoading: boolean;
  favoritesError: string | null;
  favoriteError: string | null;
};

const initialState: FavoritesState = {
  favoriteOffers: [],
  isFavoritesLoading: false,
  favoritesError: null,
  favoriteError: null,
};

const favoritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadFavoriteOffers, (state, action) => {
      state.favoriteOffers = action.payload;
      state.favoritesError = null;
    })
    .addCase(setFavoritesLoading, (state, action) => {
      state.isFavoritesLoading = action.payload;
    })
    .addCase(setFavoritesError, (state, action) => {
      state.favoritesError = action.payload;
    })
    .addCase(setFavoriteError, (state, action) => {
      state.favoriteError = action.payload;
    })
    .addCase(updateFavoriteOffer, (state, action) => {
      const updatedOffer = action.payload;
      state.favoriteOffers = updatedOffer.isFavorite
        ? [...state.favoriteOffers.filter((offer) => offer.id !== updatedOffer.id), updatedOffer]
        : state.favoriteOffers.filter((offer) => offer.id !== updatedOffer.id);
    })
    .addCase(clearFavorites, (state) => {
      state.favoriteOffers = [];
      state.favoritesError = null;
      state.favoriteError = null;
    });
});

export default favoritesReducer;
