import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import CityMap from '../../components/map/map';
import NearbyOfferList from '../../components/nearby-offer-list/nearby-offer-list';
import ReviewList from '../../components/review-list/review-list';
import ReviewForm from '../../components/review-form/review-form';
import type {Review} from '../../mocks/reviews';
import Spinner from '../../components/spinner/spinner';
import type {RootState} from '../../store';
import {selectIsOffersDataLoading, selectOffers} from '../../store/selectors';

const MAX_NEARBY_OFFERS = 3;

type OfferPageProps = {
  reviews: Review[];
};

function OfferPage({reviews}: OfferPageProps) {
  const {id} = useParams<{id: string}>();
  const offers = useSelector((state: RootState) => selectOffers(state));
  const isOffersDataLoading = useSelector((state: RootState) => selectIsOffersDataLoading(state));
  const offer = offers.find((item) => item.id === id) ?? offers[0];

  if (isOffersDataLoading && !offer) {
    return <Spinner />;
  }

  if (!offer) {
    return null;
  }

  const nearbyOffers = offers.filter((item) => item.id !== offer.id).slice(0, MAX_NEARBY_OFFERS);

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={`img/${image}`} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && <div className="offer__mark"><span>Premium</span></div>}
              <h1 className="offer__name">{offer.title}</h1>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars"><span style={{width: `${offer.rating * 20}%`}} /></div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{offer.type}</li>
                <li className="offer__feature offer__feature--bedrooms">{offer.bedrooms} Bedrooms</li>
                <li className="offer__feature offer__feature--adults">Max {offer.maxAdults} adults</li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text"> night</span>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews.length}</span></h2>
                <ReviewList reviews={reviews} />
                <ReviewForm />
              </section>
            </div>
          </div>
          <CityMap offers={nearbyOffers} activeOfferId={null} mapClassName="offer__map map" />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <NearbyOfferList offers={nearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
