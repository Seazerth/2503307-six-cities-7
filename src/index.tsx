import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './components/app/app';
import offers from './mocks/offers';
import reviews from './mocks/reviews';
import {loadOffers} from './store/action';
import {store} from './store';

store.dispatch(loadOffers(offers));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App reviews={reviews} />
    </Provider>
  </React.StrictMode>
);
