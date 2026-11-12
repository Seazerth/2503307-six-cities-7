import {memo, useCallback} from 'react';
import {Link} from 'react-router-dom';
import type {Offer} from '../../types/offer';
import {RATING_PERCENTAGE_FACTOR} from '../../constants';
import FavoriteButton from '../favorite-button/favorite-button';

type PlaceCardProps = {
  offer: Offer;
  cardClassName?: string;
  imageWrapperClassName?: string;
  onOfferHover?: (offerId: string | null) => void;
};

const PlaceCard = memo(({offer, cardClassName = 'cities__card', imageWrapperClassName = 'cities__image-wrapper', onOfferHover}: PlaceCardProps) => {
  const {id, image, price, title, type, rating, isPremium = false, isFavorite = false} = offer;
  const handleMouseEnter = useCallback(() => onOfferHover?.(id), [id, onOfferHover]);
  const handleMouseLeave = useCallback(() => onOfferHover?.(null), [onOfferHover]);

  return (
    <article
      className={`${cardClassName} place-card`}
      onMouseEnter={onOfferHover ? handleMouseEnter : undefined}
      onMouseLeave={onOfferHover ? handleMouseLeave : undefined}
    >
      {isPremium && <div className="place-card__mark"><span>Premium</span></div>}
      <div className={`${imageWrapperClassName} place-card__image-wrapper`}>
        <Link to={`/offer/${id}`}>
          <img className="place-card__image" src={image} width="260" height="200" alt="Place image" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price"><b className="place-card__price-value">&euro;{price}</b><span className="place-card__price-text">/ night</span></div>
          <FavoriteButton
            offerId={id}
            isFavorite={isFavorite}
            className="place-card__bookmark-button"
            iconClassName="place-card__bookmark-icon"
            iconWidth={18}
            iconHeight={19}
          />
        </div>
        <div className="place-card__rating rating"><div className="place-card__stars rating__stars"><span style={{width: `${Math.round(rating) * RATING_PERCENTAGE_FACTOR}%`}} /><span className="visually-hidden">Rating</span></div></div>
        <h2 className="place-card__name"><Link to={`/offer/${id}`}>{title}</Link></h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
});

PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;
