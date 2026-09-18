import {useParams} from 'react-router-dom';
import ReviewForm from '../../components/review-form/review-form';
import {Offer} from '../../mocks/offers';

type OfferPageProps = {
  offers: Offer[];
};

function OfferPage({offers}: OfferPageProps) {
  const {id} = useParams<{id: string}>();
  const offer = offers.find((item) => item.id === id) ?? offers[0];

  return <div className="page"><main className="page__main page__main--offer"><section className="offer"><div className="offer__gallery-container container"><div className="offer__gallery">{offer.images.map((image) => <div className="offer__image-wrapper" key={image}><img className="offer__image" src={`img/${image}`} alt="Photo studio" /></div>)}</div></div><div className="offer__container container"><div className="offer__wrapper">{offer.isPremium && <div className="offer__mark"><span>Premium</span></div>}<h1 className="offer__name">{offer.title}</h1><div className="offer__rating rating"><div className="offer__stars rating__stars"><span style={{width: `${offer.rating * 20}%`}} /></div><span className="offer__rating-value rating__value">{offer.rating}</span></div><ul className="offer__features"><li className="offer__feature offer__feature--entire">{offer.type}</li><li className="offer__feature offer__feature--bedrooms">{offer.bedrooms} Bedrooms</li><li className="offer__feature offer__feature--adults">Max {offer.maxAdults} adults</li></ul><div className="offer__price"><b className="offer__price-value">&euro;{offer.price}</b><span className="offer__price-text"> night</span></div><section className="offer__reviews reviews"><h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">1</span></h2><ReviewForm /></section></div></div><section className="offer__map map" /></section></main></div>;
}

export default OfferPage;
