import {BrowserRouter, Route, Routes} from 'react-router-dom';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import LoginPage from '../../pages/login-page/login-page';
import MainPage from '../../pages/main-page/main-page';
import type {Review} from '../../mocks/reviews';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import OfferPage from '../../pages/offer-page/offer-page';
import PrivateRoute from '../private-route/private-route';

type AppProps = {
  reviews: Review[];
};

function App({reviews}: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<PrivateRoute isAuthorized={false}><FavoritesPage /></PrivateRoute>} />
        <Route path="/offer/:id" element={<OfferPage reviews={reviews} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
