import {createAction} from '@reduxjs/toolkit';
import axios from 'axios';
import type {AxiosInstance} from 'axios';
import type {AnyAction} from 'redux';
import type {ThunkAction} from 'redux-thunk';
import type {ApiOffer, Offer} from '../types/offer';
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

type AppThunk = ThunkAction<Promise<void>, AppState, AxiosInstance, AnyAction>;

type AuthInfo = {
  email: string;
  token: string;
};

export type LoginData = {
  email: string;
  password: string;
};

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
