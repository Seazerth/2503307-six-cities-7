import {createAction} from '@reduxjs/toolkit';
import axios from 'axios';
import type {AxiosInstance} from 'axios';
import type {AnyAction} from 'redux';
import type {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {StatusCodes} from 'http-status-codes';
import type {ApiOffer, Offer} from '../types/offer';
import type {Review} from '../types/review';
import {TOKEN_KEY} from '../services/api';
import {FavoriteStatus} from '../constants';
import {AuthorizationStatus} from './authorization-status';
import type {AppState} from './reducer';

export const changeCity = createAction<string>('main/changeCity');
export const loadOffers = createAction<Offer[]>('offers/load');
export const setOffersDataLoading = createAction<boolean>('offers/setDataLoading');
export const setOffersLoadingError = createAction<string | null>('offers/setLoadingError');
export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
export const setUserEmail = createAction<string | null>('user/setEmail');
export const setAuthorizationError = createAction<string | null>('user/setAuthorizationError');
export const setOfferDataLoading = createAction<string>('offer/setDataLoading');
export const loadOfferData = createAction<{offerId: string; offer: Offer; nearbyOffers: Offer[]; reviews: Review[]}>('offer/loadData');
export const setOfferDataError = createAction<{offerId: string; error: string; isNotFound: boolean}>('offer/setDataError');
export const setReviewSending = createAction<{offerId: string; isSending: boolean}>('review/setSending');
export const setReviewSendingError = createAction<{offerId: string; error: string | null}>('review/setSendingError');
export const addReview = createAction<{offerId: string; review: Review}>('review/add');
export const loadFavoriteOffers = createAction<Offer[]>('favorites/load');
export const setFavoritesLoading = createAction<boolean>('favorites/setLoading');
export const setFavoritesError = createAction<string | null>('favorites/setError');
export const setFavoriteError = createAction<string | null>('favorite/setError');
export const updateFavoriteOffer = createAction<Offer>('favorite/update');
export const clearFavorites = createAction('favorites/clear');

type AppThunk = ThunkAction<Promise<void>, AppState, AxiosInstance, AnyAction>;
type ReviewThunk = ThunkAction<Promise<boolean>, AppState, AxiosInstance, AnyAction>;
type AppDispatcher = ThunkDispatch<AppState, AxiosInstance, AnyAction>;

type AuthInfo = {
  email: string;
  token: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type NewReview = {
  offerId: string;
  comment: string;
  rating: number;
};

function adaptOffer({city, previewImage, ...offer}: ApiOffer): Offer {
  const {location: cityLocation, ...cityData} = city;
  return {
    ...offer,
    city: cityData.name,
    cityLocation,
    image: previewImage ?? offer.images?.[0] ?? '',
    images: offer.images ?? (previewImage ? [previewImage] : []),
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{message?: string}>(error)) {
    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : String(error);
}

function handleUnauthorized(error: unknown, dispatch: AppDispatcher): void {
  if (axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
    dispatch(setUserEmail(null));
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(setAuthorizationError('Your session has expired. Please sign in again.'));
    dispatch(clearFavorites());
  }
}

export const fetchOffers = (): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setOffersDataLoading(true));
  dispatch(setOffersLoadingError(null));

  try {
    const response = await api.get<ApiOffer[]>('/offers');
    dispatch(loadOffers(response.data.map(adaptOffer)));
  } catch (error) {
    dispatch(setOffersLoadingError(error instanceof Error ? error.message : String(error)));
    handleUnauthorized(error, dispatch);
  } finally {
    dispatch(setOffersDataLoading(false));
  }
};

export const fetchFavoriteOffers = (): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setFavoritesLoading(true));
  dispatch(setFavoritesError(null));

  try {
    const response = await api.get<ApiOffer[]>('/favorite');
    if (_getState().user.authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(loadFavoriteOffers(response.data.map(adaptOffer)));
    }
  } catch (error) {
    dispatch(setFavoritesError(getErrorMessage(error)));
    handleUnauthorized(error, dispatch);
  } finally {
    dispatch(setFavoritesLoading(false));
  }
};

export const toggleFavorite = (offerId: string): AppThunk => async (dispatch, getState, api) => {
  const {favorites, main, offer: offerState, user} = getState();
  if (user.authorizationStatus !== AuthorizationStatus.Auth) {
    return;
  }

  const offer = (offerState.activeOffer?.id === offerId ? offerState.activeOffer : undefined)
    ?? offerState.nearbyOffers.find((item) => item.id === offerId)
    ?? main.offers.find((item) => item.id === offerId)
    ?? favorites.favoriteOffers.find((favorite) => favorite.id === offerId);

  if (!offer) {
    dispatch(setFavoriteError('Could not find this offer.'));
    return;
  }

  const status = favorites.favoriteOffers.some((favorite) => favorite.id === offerId)
    ? FavoriteStatus.Unfavorite
    : FavoriteStatus.Favorite;
  dispatch(setFavoriteError(null));

  try {
    const response = await api.post<ApiOffer>(`/favorite/${offerId}/${status}`);
    const updatedOffer = adaptOffer(response.data);
    if (getState().user.authorizationStatus !== AuthorizationStatus.Auth) {
      return;
    }

    dispatch(updateFavoriteOffer({
      ...offer,
      ...updatedOffer,
      images: response.data.images ?? offer.images,
      description: response.data.description ?? offer.description,
      goods: response.data.goods ?? offer.goods,
      host: response.data.host ?? offer.host,
      bedrooms: response.data.bedrooms ?? offer.bedrooms,
      maxAdults: response.data.maxAdults ?? offer.maxAdults,
    }));
  } catch (error) {
    dispatch(setFavoriteError(getErrorMessage(error)));
    handleUnauthorized(error, dispatch);
  }
};

export const fetchOfferData = (offerId: string): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setOfferDataLoading(offerId));

  try {
    const [offerResponse, nearbyOffersResponse, reviewsResponse] = await Promise.all([
      api.get<ApiOffer>(`/offers/${offerId}`),
      api.get<ApiOffer[]>(`/offers/${offerId}/nearby`),
      api.get<Review[]>(`/comments/${offerId}`),
    ]);

    dispatch(loadOfferData({
      offerId,
      offer: adaptOffer(offerResponse.data),
      nearbyOffers: nearbyOffersResponse.data.map(adaptOffer),
      reviews: reviewsResponse.data,
    }));
  } catch (error) {
    dispatch(setOfferDataError({
      offerId,
      error: getErrorMessage(error),
      isNotFound: axios.isAxiosError(error) && error.response?.status === StatusCodes.NOT_FOUND,
    }));
    handleUnauthorized(error, dispatch);
  }
};

export const postReview = ({offerId, comment, rating}: NewReview): ReviewThunk => async (dispatch, _getState, api) => {
  dispatch(setReviewSendingError({offerId, error: null}));
  dispatch(setReviewSending({offerId, isSending: true}));

  try {
    const response = await api.post<Review>(`/comments/${offerId}`, {comment, rating});
    dispatch(addReview({offerId, review: response.data}));
    return true;
  } catch (error) {
    dispatch(setReviewSendingError({offerId, error: getErrorMessage(error)}));
    handleUnauthorized(error, dispatch);
    return false;
  } finally {
    dispatch(setReviewSending({offerId, isSending: false}));
  }
};

export const checkAuth = (): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setAuthorizationError(null));

  try {
    const response = await api.get<AuthInfo>('/login');
    localStorage.setItem(TOKEN_KEY, response.data.token);
    dispatch(setUserEmail(response.data.email));
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    dispatch(clearFavorites());
    void dispatch(fetchFavoriteOffers());
  } catch (error) {
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    if (!(axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED)) {
      dispatch(setAuthorizationError(getErrorMessage(error)));
    } else {
      dispatch(setUserEmail(null));
      dispatch(clearFavorites());
    }
  }
};

export const login = ({email, password}: LoginData): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setAuthorizationStatus(AuthorizationStatus.Unknown));
  dispatch(setAuthorizationError(null));
  dispatch(setFavoriteError(null));
  dispatch(setFavoritesError(null));

  try {
    const response = await api.post<AuthInfo>('/login', {email, password});
    localStorage.setItem(TOKEN_KEY, response.data.token);
    dispatch(setUserEmail(response.data.email));
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    dispatch(setAuthorizationError(null));
    void dispatch(fetchFavoriteOffers());
  } catch (error) {
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(setAuthorizationError(getErrorMessage(error)));
  }
};

export const logout = (): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setAuthorizationError(null));

  try {
    await api.delete('/logout');
    localStorage.removeItem(TOKEN_KEY);
    dispatch(setUserEmail(null));
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(clearFavorites());
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
      dispatch(setUserEmail(null));
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(clearFavorites());
      return;
    }
    dispatch(setAuthorizationError(getErrorMessage(error)));
  }
};
