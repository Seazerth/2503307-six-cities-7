import {createAction} from '@reduxjs/toolkit';
import axios from 'axios';
import type {AxiosInstance} from 'axios';
import type {AnyAction} from 'redux';
import type {ThunkAction} from 'redux-thunk';
import type {ApiOffer, Offer} from '../types/offer';
import type {Review} from '../types/review';
import {TOKEN_KEY} from '../services/api';
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

type AppThunk = ThunkAction<Promise<void>, AppState, AxiosInstance, AnyAction>;
type ReviewThunk = ThunkAction<Promise<boolean>, AppState, AxiosInstance, AnyAction>;

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
  return {
    ...offer,
    city: city.name,
    image: previewImage,
    images: offer.images ?? [previewImage],
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{message?: string}>(error)) {
    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : String(error);
}

export const fetchOffers = (): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setOffersDataLoading(true));
  dispatch(setOffersLoadingError(null));

  try {
    const response = await api.get<ApiOffer[]>('/offers');
    const offers = response.data.map(({city, previewImage, ...offer}) => ({
      ...offer,
      city: city.name,
      image: previewImage,
      images: [previewImage],
    }));

    dispatch(loadOffers(offers));
  } catch (error) {
    dispatch(setOffersLoadingError(error instanceof Error ? error.message : String(error)));
  } finally {
    dispatch(setOffersDataLoading(false));
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
      isNotFound: axios.isAxiosError(error) && error.response?.status === 404,
    }));
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
  } catch (error) {
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    if (!(axios.isAxiosError(error) && error.response?.status === 401)) {
      dispatch(setAuthorizationError(getErrorMessage(error)));
    }
  }
};

export const login = ({email, password}: LoginData): AppThunk => async (dispatch, _getState, api) => {
  dispatch(setAuthorizationStatus(AuthorizationStatus.Unknown));
  dispatch(setAuthorizationError(null));

  try {
    const response = await api.post<AuthInfo>('/login', {email, password});
    localStorage.setItem(TOKEN_KEY, response.data.token);
    dispatch(setUserEmail(response.data.email));
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
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
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      dispatch(setUserEmail(null));
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      return;
    }
    dispatch(setAuthorizationError(getErrorMessage(error)));
  }
};
