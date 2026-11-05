import {createReducer} from '@reduxjs/toolkit';
import {
  setAuthorizationError,
  setAuthorizationStatus,
  setUserEmail,
} from '../action';
import {AuthorizationStatus} from '../authorization-status';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  userEmail: string | null;
  authorizationError: string | null;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userEmail: null,
  authorizationError: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
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

export default userReducer;
