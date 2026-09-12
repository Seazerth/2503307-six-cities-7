function FavoritesPage() {
  return (
    <div className="page"><main className="page__main page__main--favorites"><div className="page__favorites-container container"><section className="favorites"><h1 className="favorites__title">Saved listing</h1><ul className="favorites__list"><li className="favorites__locations-items"><div className="favorites__locations locations locations--current"><div className="locations__item"><a className="locations__item-link" href="#"><span>Amsterdam</span></a></div></div><div className="favorites__places"><article className="favorites__card place-card"><div className="favorites__image-wrapper place-card__image-wrapper"><a href="#"><img className="place-card__image" src="img/apartment-small-03.jpg" width="150" height="110" alt="Place image" /></a></div><div className="favorites__card-info place-card__info"><h2 className="place-card__name"><a href="#">Nice, cozy, warm big bed apartment</a></h2><p className="place-card__type">Apartment</p></div></article></div></li></ul></section></div></main><footer className="footer container"><a className="footer__logo-link" href="#"><img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" /></a></footer></div>
  );
}

export default FavoritesPage;
