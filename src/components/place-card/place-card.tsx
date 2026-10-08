import {Link} from 'react-router-dom';
import {Offer} from '../../mocks/offers';

type PlaceCardProps = {
  offer: Offer;
  cardClassName?: string;
  onMouseEnter?: () => void;
};

function PlaceCard({offer, cardClassName = 'cities__card', onMouseEnter}: PlaceCardProps) {
  const {id, image, price, title, type, rating, isPremium = false, isFavorite = false} = offer;

  return (
    <article className={`${cardClassName} place-card`} onMouseEnter={onMouseEnter}>
      {isPremium && <div className="place-card__mark"><span>Premium</span></div>}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${id}`}>
          <img className="place-card__image" src={`img/${image}`} width="260" height="200" alt="Place image" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price"><b className="place-card__price-value">&euro;{price}</b><span className="place-card__price-text">/ night</span></div>
          <button className={`place-card__bookmark-button${isFavorite ? ' place-card__bookmark-button--active' : ''} button`} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19"><use xlinkHref="#icon-bookmark" /></svg>
            <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating"><div className="place-card__stars rating__stars"><span style={{width: `${rating * 20}%`}} /><span className="visually-hidden">Rating</span></div></div>
        <h2 className="place-card__name"><Link to={`/offer/${id}`}>{title}</Link></h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
