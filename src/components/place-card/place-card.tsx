type PlaceCardProps = {
  image: string;
  price: number;
  title: string;
  type: string;
  isPremium?: boolean;
  isFavorite?: boolean;
};

function PlaceCard({image, price, title, type, isPremium = false, isFavorite = false}: PlaceCardProps) {
  return (
    <article className="cities__card place-card">
      {isPremium && <div className="place-card__mark"><span>Premium</span></div>}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <a href="#">
          <img className="place-card__image" src={`img/${image}`} width="260" height="200" alt="Place image" />
        </a>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">/ night</span>
          </div>
          <button className={`place-card__bookmark-button${isFavorite ? ' place-card__bookmark-button--active' : ''} button`} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19"><use xlinkHref="#icon-bookmark" /></svg>
            <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars"><span style={{width: '80%'}} /><span className="visually-hidden">Rating</span></div>
        </div>
        <h2 className="place-card__name"><a href="#">{title}</a></h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
