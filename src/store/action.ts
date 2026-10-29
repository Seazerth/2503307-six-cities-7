import {createAction} from '@reduxjs/toolkit';
import type {AxiosInstance} from 'axios';
import type {AnyAction} from 'redux';
import type {ThunkAction} from 'redux-thunk';
import type {ApiOffer, Offer} from '../types/offer';
import type {AppState} from './reducer';

export const changeCity = createAction<string>('main/changeCity');
export const loadOffers = createAction<Offer[]>('offers/load');
export const setOffersDataLoading = createAction<boolean>('offers/setDataLoading');
export const setOffersLoadingError = createAction<string | null>('offers/setLoadingError');

type AppThunk = ThunkAction<Promise<void>, AppState, AxiosInstance, AnyAction>;

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
