import {createSelector} from '@reduxjs/toolkit';
import type {AppState} from './reducer';

export const selectCity = (state: AppState) => state.main.city;
export const selectOffers = (state: AppState) => state.main.offers;
export const selectIsOffersDataLoading = (state: AppState) => state.main.isOffersDataLoading;
export const selectOffersLoadingError = (state: AppState) => state.main.offersLoadingError;
export const selectAuthorizationStatus = (state: AppState) => state.user.authorizationStatus;
export const selectUserEmail = (state: AppState) => state.user.userEmail;
export const selectAuthorizationError = (state: AppState) => state.user.authorizationError;
export const selectRawActiveOffer = (state: AppState) => state.offer.activeOffer;
export const selectRawNearbyOffers = (state: AppState) => state.offer.nearbyOffers;
export const selectReviews = (state: AppState) => state.offer.reviews;
export const selectOfferDataId = (state: AppState) => state.offer.offerDataId;
export const selectIsOfferDataLoading = (state: AppState) => state.offer.isOfferDataLoading;
export const selectOfferDataError = (state: AppState) => state.offer.offerDataError;
export const selectIsOfferNotFound = (state: AppState) => state.offer.isOfferNotFound;
export const selectIsReviewSending = (state: AppState) => state.offer.isReviewSending;
export const selectReviewSendingError = (state: AppState) => state.offer.reviewSendingError;
export const selectFavoriteOffers = (state: AppState) => state.favorites.favoriteOffers;
export const selectFavoritesLoading = (state: AppState) => state.favorites.isFavoritesLoading;
export const selectFavoritesError = (state: AppState) => state.favorites.favoritesError;
export const selectFavoriteError = (state: AppState) => state.favorites.favoriteError;

export const selectSortedReviews = createSelector(
  [selectReviews],
  (reviews) => [...reviews].sort((firstReview, secondReview) => Date.parse(secondReview.date) - Date.parse(firstReview.date))
);

const selectFavoriteIds = createSelector(
  [selectFavoriteOffers],
  (offers) => new Set(offers.map((offer) => offer.id))
);

function withFavoriteStatus<T extends {id: string; isFavorite: boolean}>(offer: T, favoriteIds: Set<string>): T {
  const isFavorite = favoriteIds.has(offer.id);
  return offer.isFavorite === isFavorite ? offer : {...offer, isFavorite};
}

export const selectActiveOffer = createSelector(
  [selectRawActiveOffer, selectFavoriteIds],
  (offer, favoriteIds) => offer ? withFavoriteStatus(offer, favoriteIds) : null
);

export const selectNearbyOffers = createSelector(
  [selectRawNearbyOffers, selectFavoriteIds],
  (offers, favoriteIds) => offers.map((offer) => withFavoriteStatus(offer, favoriteIds))
);

export const selectFavoriteCount = createSelector(
  [selectFavoriteOffers],
  (offers) => offers.length
);

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity, selectFavoriteIds],
  (offers, city, favoriteIds) => offers
    .filter((offer) => offer.city === city)
    .map((offer) => withFavoriteStatus(offer, favoriteIds))
);

export const selectRawOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city)
);
