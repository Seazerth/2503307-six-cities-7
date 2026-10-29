import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import PlaceCard from '../../components/place-card/place-card';
import type {Offer} from '../../types/offer';
import type {RootState} from '../../store';
import {selectFavoriteOffers} from '../../store/selectors';

function FavoritesPage() {
  const favoriteOffers = useSelector((state: RootState) => selectFavoriteOffers(state));
  const favoriteOffersByCity = favoriteOffers.reduce((cityGroups, offer) => {
    const cityOffers = cityGroups.get(offer.city) ?? [];
    cityOffers.push(offer);
    cityGroups.set(offer.city, cityOffers);
    return cityGroups;
  }, new Map<string, Offer[]>());

  return (
    <div className="page">
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {Array.from(favoriteOffersByCity, ([city, cityOffers]) => (
                <li className="favorites__locations-items" key={city}>
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <Link className="locations__item-link" to={`/?city=${encodeURIComponent(city)}`}><span>{city}</span></Link>
                    </div>
                  </div>
                  <div className="favorites__places">
                    {cityOffers.map((offer) => <PlaceCard offer={offer} cardClassName="favorites__card" key={offer.id} />)}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/"><img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" /></Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
