import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Navigate, useParams} from 'react-router-dom';
import CityMap from '../../components/map/map';
import NearbyOfferList from '../../components/nearby-offer-list/nearby-offer-list';
import ReviewList from '../../components/review-list/review-list';
import ReviewForm from '../../components/review-form/review-form';
import Spinner from '../../components/spinner/spinner';
import {AuthorizationStatus} from '../../store/authorization-status';
import type {AppDispatch, RootState} from '../../store';
import {fetchOfferData} from '../../store/action';
import {
  selectActiveOffer,
  selectAuthorizationStatus,
  selectIsOfferDataLoading,
  selectIsOfferNotFound,
  selectNearbyOffers,
  selectOfferDataError,
  selectOfferDataId,
  selectReviews,
} from '../../store/selectors';

const MAX_NEARBY_OFFERS = 3;
const MAX_REVIEWS = 10;

function OfferPage() {
  const {id} = useParams<{id: string}>();
  const dispatch = useDispatch<AppDispatch>();
  const offer = useSelector((state: RootState) => selectActiveOffer(state));
  const nearbyOffers = useSelector((state: RootState) => selectNearbyOffers(state));
  const reviews = useSelector((state: RootState) => selectReviews(state));
  const offerDataId = useSelector((state: RootState) => selectOfferDataId(state));
  const isOfferDataLoading = useSelector((state: RootState) => selectIsOfferDataLoading(state));
  const offerDataError = useSelector((state: RootState) => selectOfferDataError(state));
  const isOfferNotFound = useSelector((state: RootState) => selectIsOfferNotFound(state));
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));

  useEffect(() => {
    if (id) {
      void dispatch(fetchOfferData(id));
    }
  }, [dispatch, id]);

  if (!id || (offerDataId === id && isOfferNotFound)) {
    return <Navigate to="/404" replace />;
  }

  if (offerDataId !== id || isOfferDataLoading) {
    return <Spinner />;
  }

  if (offerDataError || !offer) {
    return (
      <main className="page__main">
        <p role="alert">{offerDataError ?? 'Could not load this offer.'}</p>
        <Link to="/">Return to the main page</Link>
      </main>
    );
  }

  const displayedNearbyOffers = nearbyOffers.slice(0, MAX_NEARBY_OFFERS);
  const displayedReviews = [...reviews]
    .sort((firstReview, secondReview) => Date.parse(secondReview.date) - Date.parse(firstReview.date))
    .slice(0, MAX_REVIEWS);

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={image} alt={offer.title} />
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
                <ReviewList reviews={displayedReviews} />
                {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offer.id} />}
              </section>
            </div>
          </div>
          <CityMap
            offers={[offer, ...displayedNearbyOffers]}
            activeOfferId={offer.id}
            mapClassName="offer__map map"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <NearbyOfferList offers={displayedNearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
