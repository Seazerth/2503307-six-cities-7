import {BrowserRouter, Route, Routes} from 'react-router-dom';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import LoginPage from '../../pages/login-page/login-page';
import MainPage from '../../pages/main-page/main-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import OfferPage from '../../pages/offer-page/offer-page';
import PrivateRoute from '../private-route/private-route';
import {Offer} from '../../mocks/offers';

type AppProps = {
  offersCount: number;
  offers: Offer[];
};

function App({offersCount, offers}: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offersCount={offersCount} offers={offers} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<PrivateRoute isAuthorized={false}><FavoritesPage offers={offers} /></PrivateRoute>} />
        <Route path="/offer/:id" element={<OfferPage offers={offers} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
