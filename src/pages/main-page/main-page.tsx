import {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import CityMap from '../../components/map/map';
import CityList from '../../components/city-list/city-list';
import PlaceList from '../../components/place-list/place-list';
import SortOptions from '../../components/sort-options/sort-options';
import {SortType} from '../../components/sort-options/sort-type';
import {CITIES} from '../../mocks/cities';
import type {Offer} from '../../types/offer';
import {changeCity, logout} from '../../store/action';
import type {AppDispatch, RootState} from '../../store';
import Spinner from '../../components/spinner/spinner';
import {selectAuthorizationError, selectAuthorizationStatus, selectCity, selectIsOffersDataLoading, selectOffersForCity, selectOffersLoadingError, selectUserEmail} from '../../store/selectors';
import {AuthorizationStatus} from '../../store/authorization-status';

function getSortedOffers(offers: Offer[], sortType: SortType): Offer[] {
  switch (sortType) {
    case SortType.PriceLowToHigh:
      return [...offers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);
    case SortType.PriceHighToLow:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.price - firstOffer.price);
    case SortType.TopRatedFirst:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.rating - firstOffer.rating);
    case SortType.Popular:
      return offers;
  }
}

function MainPage() {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [sortType, setSortType] = useState(SortType.Popular);
  const dispatch = useDispatch<AppDispatch>();
  const activeCity = useSelector((state: RootState) => selectCity(state));
  const cityOffers = useSelector((state: RootState) => selectOffersForCity(state));
  const isOffersDataLoading = useSelector((state: RootState) => selectIsOffersDataLoading(state));
  const offersLoadingError = useSelector((state: RootState) => selectOffersLoadingError(state));
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));
  const userEmail = useSelector((state: RootState) => selectUserEmail(state));
  const authorizationError = useSelector((state: RootState) => selectAuthorizationError(state));
  const sortedOffers = useMemo(() => getSortedOffers(cityOffers, sortType), [cityOffers, sortType]);

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === AuthorizationStatus.Auth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper" />
                        <span className="header__user-name user__name">{userEmail}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <button
                        className="header__nav-link button"
                        type="button"
                        onClick={() => {
                          void dispatch(logout());
                        }}
                      >
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item">
                    <Link className="header__nav-link" to="/login">Sign in</Link>
                  </li>
                )}
              </ul>
            </nav>
            {authorizationError && <p role="alert">{authorizationError}</p>}
          </div>
        </div>
      </header>
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityList cities={CITIES} activeCity={activeCity} onCityChange={(city) => dispatch(changeCity(city))} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places" data-active-offer={activeOfferId ?? undefined}>
              <h2 className="visually-hidden">Places</h2>
              {isOffersDataLoading && <Spinner />}
              {!isOffersDataLoading && offersLoadingError && <p role="alert">Could not load offers: {offersLoadingError}</p>}
              {!isOffersDataLoading && !offersLoadingError && (
                <>
                  <b className="places__found">{cityOffers.length} places to stay in {activeCity}</b>
                  <SortOptions sortType={sortType} onSortChange={setSortType} />
                  <PlaceList offers={sortedOffers} onOfferHover={setActiveOfferId} />
                </>
              )}
            </section>
            <div className="cities__right-section">
              <CityMap offers={sortedOffers} activeOfferId={activeOfferId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
