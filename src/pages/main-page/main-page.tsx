import {useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import CityMap from '../../components/map/map';
import PlaceList from '../../components/place-list/place-list';
import type {Offer} from '../../mocks/offers';

const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
const ACTIVE_CITY = 'Amsterdam';

type MainPageProps = {
  offers: Offer[];
};

function MainPage({offers}: MainPageProps) {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const activeCity = CITIES.find((city) => city === searchParams.get('city')) ?? ACTIVE_CITY;
  const cityOffers = offers.filter((offer) => offer.city === activeCity);

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
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <button className="header__nav-link button" type="button"><span className="header__signout">Sign out</span></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {CITIES.map((city) => (
                <li className="locations__item" key={city}>
                  <Link className={`locations__item-link tabs__item${city === activeCity ? ' tabs__item--active' : ''}`} to={`/?city=${encodeURIComponent(city)}`}><span>{city}</span></Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places" data-active-offer={activeOfferId ?? undefined}>
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length} places to stay in {activeCity}</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>Popular<svg className="places__sorting-arrow" width="7" height="4"><use xlinkHref="#icon-arrow-select" /></svg></span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                  <li className="places__option" tabIndex={0}>Price: low to high</li>
                  <li className="places__option" tabIndex={0}>Price: high to low</li>
                  <li className="places__option" tabIndex={0}>Top rated first</li>
                </ul>
              </form>
              <PlaceList offers={cityOffers} onOfferHover={setActiveOfferId} />
            </section>
            <div className="cities__right-section">
              <CityMap offers={cityOffers} activeOfferId={activeOfferId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
