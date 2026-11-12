import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import LoginPage from '../../pages/login-page/login-page';
import MainPage from '../../pages/main-page/main-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import OfferPage from '../../pages/offer-page/offer-page';
import Header from '../header/header';
import PrivateRoute from '../private-route/private-route';
import type {RootState} from '../../store';
import {
  selectAuthorizationStatus,
  selectFavoriteOffers,
  selectFavoritesError,
  selectFavoritesLoading,
} from '../../store/selectors';
import {AuthorizationStatus} from '../../store/authorization-status';

function getPageClassName(pathname: string, isFavoritesEmpty: boolean): string {
  if (pathname === '/') {
    return 'page page--gray page--main';
  }

  if (pathname === '/login') {
    return 'page page--gray page--login';
  }

  if (pathname === '/favorites' && isFavoritesEmpty) {
    return 'page page--favorites-empty';
  }

  return 'page';
}

function AppRoutes() {
  const {pathname} = useLocation();
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));
  const favoriteOffers = useSelector((state: RootState) => selectFavoriteOffers(state));
  const isFavoritesLoading = useSelector((state: RootState) => selectFavoritesLoading(state));
  const favoritesError = useSelector((state: RootState) => selectFavoritesError(state));
  const isFavoritesEmpty = authorizationStatus === AuthorizationStatus.Auth
    && !isFavoritesLoading
    && !favoritesError
    && favoriteOffers.length === 0;
  const pageClassName = getPageClassName(pathname, isFavoritesEmpty);

  return (
    <div className={pageClassName}>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
