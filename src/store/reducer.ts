import {combineReducers} from '@reduxjs/toolkit';
import favoritesReducer from './reducers/favorites-reducer';
import mainReducer from './reducers/main-reducer';
import offerReducer from './reducers/offer-reducer';
import userReducer from './reducers/user-reducer';

const reducer = combineReducers({
  main: mainReducer,
  user: userReducer,
  offer: offerReducer,
  favorites: favoritesReducer,
});

export type AppState = ReturnType<typeof reducer>;

export default reducer;
