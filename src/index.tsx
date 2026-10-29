import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './components/app/app';
import reviews from './mocks/reviews';
import {fetchOffers} from './store/action';
import {store} from './store';

store.dispatch(fetchOffers());

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
