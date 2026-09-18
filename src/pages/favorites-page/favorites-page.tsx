import PlaceCard from '../../components/place-card/place-card';
import {Offer} from '../../mocks/offers';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({offers}: FavoritesPageProps) {
  return <div className="page"><main className="page__main page__main--favorites"><div className="page__favorites-container container"><section className="favorites"><h1 className="favorites__title">Saved listing</h1><ul className="favorites__list"><li className="favorites__locations-items"><div className="favorites__locations locations locations--current"><div className="locations__item"><a className="locations__item-link" href="#"><span>Amsterdam</span></a></div></div><div className="favorites__places">{offers.filter((offer) => offer.isFavorite).map((offer) => <PlaceCard offer={offer} cardClassName="favorites__card" key={offer.id} />)}</div></li></ul></section></div></main><footer className="footer container"><a className="footer__logo-link" href="#"><img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" /></a></footer></div>;
}

export default FavoritesPage;
